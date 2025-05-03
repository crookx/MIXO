import express from 'express';
import { validateToken } from '../middleware/auth';
import { validateMpesaPayment, validateMpesaCallback } from '../middleware/paymentValidators';
import {
  initiateMpesaPayment,
  handleMpesaCallback,
  checkPaymentStatus
} from '../controllers/payments';

const router = express.Router();

// Protected routes (require authentication)
router.use('/mpesa', validateToken);

// M-Pesa routes
router.post('/mpesa/initiate', validateMpesaPayment, initiateMpesaPayment);
router.get('/mpesa/status/:orderId', checkPaymentStatus);

// M-Pesa callback (public endpoint but validated)
router.post('/mpesa/callback', validateMpesaCallback, handleMpesaCallback);

export default router;