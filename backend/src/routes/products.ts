import express from 'express';
import { validateToken } from '../middleware/auth';
import { validateAdmin } from '../middleware/admin';
import { validateProduct, validateProductUpdate } from '../middleware/productValidators';
import { 
  createProduct, 
  getProducts, 
  getProduct, 
  updateProduct, 
  deleteProduct,
  updateStock,
  getAllProducts
} from '../controllers/products';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Protected routes (require authentication and admin role)
router.use(validateToken, validateAdmin);

router.post('/', validateProduct, createProduct);
router.put('/:id', validateProductUpdate, updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/stock', updateStock);

export default router;
