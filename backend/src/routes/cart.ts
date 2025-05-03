import express from 'express';
import { validateToken } from '../middleware/auth';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart,
  clearCart 
} from '../controllers/cart';

const router = express.Router();

// All cart routes require authentication
router.use(validateToken);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/item/:itemId', removeFromCart);
router.delete('/clear', clearCart);

export default router;