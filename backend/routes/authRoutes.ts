import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  createAdminSecure
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/setup-admin', createAdminSecure);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
