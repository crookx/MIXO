import express from 'express';
import { validateToken } from '../middleware/auth';
import { validateAdmin } from '../middleware/admin';
import {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orders';

const router = express.Router();

// All order routes require authentication
router.use(validateToken);

// User routes
router.post('/', createOrder);
router.get('/my-orders', getUserOrders);
router.get('/:id', getOrder);
router.post('/:id/cancel', cancelOrder);

// Admin routes
router.patch('/:id/status', validateAdmin, updateOrderStatus);

export default router;