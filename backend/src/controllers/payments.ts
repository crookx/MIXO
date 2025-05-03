import { Request, Response } from 'express';
import { mpesaService } from '../services/mpesa';
import { Order, IOrder } from '../models/Order';
import { MpesaPayment } from '../types/database';
import { STKCallback } from '../types/mpesa';

export const initiateMpesaPayment = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, orderId } = req.body;

    const order = await Order.findOne({ 
      _id: orderId,
      user: req.user._id,
      'payment.status': 'pending'
    }).exec() as IOrder & { _id: string }; // Add explicit typing for _id

    if (!order) {
      return res.status(404).json({ message: 'Order not found or already paid' });
    }

    const formattedPhone = phoneNumber.startsWith('254') 
      ? phoneNumber 
      : `254${phoneNumber.replace(/^0+/, '')}`;

    const stkResponse = await mpesaService.initiateSTKPush(
      formattedPhone,
      order.total,
      order._id.toString()
    );

    if (order.payment) {
      order.payment.transactionId = stkResponse.CheckoutRequestID;
      await order.save();
    }

    res.json({
      message: 'Payment initiated',
      checkoutRequestId: stkResponse.CheckoutRequestID
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ message: 'Error initiating payment' });
  }
};

export const handleMpesaCallback = async (req: Request, res: Response) => {
  try {
    const { Body } = req.body;
    const stkCallback = Body.stkCallback as STKCallback;
    
    const order = await Order.findOne({
      'payment.transactionId': stkCallback.CheckoutRequestID
    }) as IOrder | null;

    if (!order || !order.payment) {
      console.error('Order not found for checkout request:', stkCallback.CheckoutRequestID);
      return res.status(404).json({ message: 'Order not found' });
    }

    if (stkCallback.ResultCode === 0) {
      const metadata = stkCallback.CallbackMetadata?.Item;
      if (metadata) {
        const amount = metadata.find(i => i.Name === 'Amount')?.Value as number;
        const mpesaReceiptNumber = metadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value as string;
        const transactionDate = metadata.find(i => i.Name === 'TransactionDate')?.Value;

        order.payment.status = 'completed';
        order.payment.transactionId = mpesaReceiptNumber;
        order.payment.amount = amount;
        order.payment.paidAt = transactionDate ? new Date(transactionDate) : new Date();
        order.status = 'processing';
      }
    } else {
      order.payment.status = 'failed';
      order.status = 'pending';
    }

    await order.save();
    res.json({ message: 'Callback processed successfully' });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    res.status(500).json({ message: 'Error processing callback' });
  }
};

export const checkPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ 
      _id: orderId,
      user: req.user._id
    }) as IOrder | null;

    if (!order || !order.payment) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.payment.status === 'pending' && order.payment.transactionId) {
      const isValid = await mpesaService.validateTransaction(order.payment.transactionId);
      if (isValid) {
        order.payment.status = 'completed';
        order.status = 'processing';
        await order.save();
      }
    }

    res.json({
      status: order.payment.status,
      transactionId: order.payment.transactionId
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({ message: 'Error checking payment status' });
  }
};