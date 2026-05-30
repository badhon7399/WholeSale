import { Router } from 'express';
import { register, login, logout, getProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { registerValidation, loginValidation } from '../middleware/validate';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);

export default router;
