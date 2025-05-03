import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const mpesaPaymentSchema = z.object({
  phoneNumber: z.string()
    .regex(/^(254|0)\d{9}$/, 'Invalid phone number format. Use 254XXXXXXXXX or 07XXXXXXXX')
    .transform(val => val.replace(/^0/, '254')),
  orderId: z.string().uuid({ message: 'Invalid order ID' })
});

export const validateMpesaPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await mpesaPaymentSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        message: 'Invalid payment data',
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    } else {
      res.status(400).json({ message: 'Invalid input' });
    }
  }
};

// Validate M-Pesa callback payload
export const validateMpesaCallback = (req: Request, res: Response, next: NextFunction) => {
  const { Body } = req.body;
  
  if (!Body?.stkCallback?.CheckoutRequestID) {
    return res.status(400).json({ message: 'Invalid callback data' });
  }
  
  next();
};