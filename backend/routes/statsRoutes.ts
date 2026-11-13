import { Router } from 'express';
import { getAdminStats, resetSeedData } from '../controllers/statsController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Protected admin stats
router.get('/dashboard', protect, adminOnly, getAdminStats);
router.post('/reset-seed', protect, adminOnly, resetSeedData);

export default router;
