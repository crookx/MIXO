import { Request, Response } from 'express';
import { Order, IOrder } from '../models/Order';
import { Cart, ICart } from '../models/Cart';
import { Product } from '../models/Product';
import { sendSuccess, sendError } from '../types/api';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { shipping, payment } = req.body;
    
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product') as ICart | null;
    if (!cart || cart.items.length === 0) {
      return sendError(res, 'Cart is empty', 400);
    }

    const totals = cart.calculateTotals();

    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color
      })),
      shipping,
      payment: {
        ...payment,
        amount: totals.total,
        status: 'pending'
      },
      subtotal: totals.subtotal,
      shippingCost: totals.shipping,
      total: totals.total
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart after order creation
    cart.items.splice(0, cart.items.length); // Replace direct assignment with splice
    await cart.save();

    sendSuccess(res, order, 'Order created successfully', 201);
  } catch (error) {
    console.error('Create order error:', error);
    sendError(res, 'Error creating order');
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .populate('items.product')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Order.countDocuments({ user: req.user._id })
    ]);

    sendSuccess(res, orders, 'Orders retrieved successfully', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get orders error:', error);
    sendError(res, 'Error fetching orders');
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product') as IOrder | null;
    if (!order) {
      return sendError(res, 'Order not found', 404);
    }
    
    if (order.user.toString() !== req.user._id && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized', 403);
    }

    sendSuccess(res, order, 'Order retrieved successfully');
  } catch (error) {
    console.error('Get order error:', error);
    sendError(res, 'Error fetching order');
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id) as IOrder | null;
    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    order.status = status;
    await order.save();

    sendSuccess(res, order, 'Order status updated successfully');
  } catch (error) {
    console.error('Update order error:', error);
    sendError(res, 'Error updating order');
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id) as IOrder | null;
    if (!order) {
      return sendError(res, 'Order not found', 404);
    }

    if (order.user.toString() !== req.user._id) {
      return sendError(res, 'Not authorized', 403);
    }

    if (order.status !== 'pending') {
      return sendError(res, 'Order cannot be cancelled', 400);
    }

    order.status = 'cancelled';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    sendSuccess(res, order, 'Order cancelled successfully');
  } catch (error) {
    console.error('Cancel order error:', error);
    sendError(res, 'Error cancelling order');
  }
};