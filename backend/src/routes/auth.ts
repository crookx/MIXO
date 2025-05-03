import express from 'express';
import { register, login, getCurrentUser, logout } from '../controllers/auth';
import { validateToken } from '../middleware/auth';
import { validateRegister, validateLogin } from '../middleware/validators';

const router = express.Router();

// Auth routes with validation
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', validateToken, getCurrentUser);
router.post('/logout', validateToken, logout);

export default router;