import { Router } from 'express';
import { getSupplierStats, getBuyerStats } from '../controllers/dashboardController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/supplier', authenticate, authorize(['supplier']), getSupplierStats);
router.get('/buyer', authenticate, authorize(['buyer']), getBuyerStats);

export default router;
