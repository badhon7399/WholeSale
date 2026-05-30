import { Router } from 'express';
import { getSuppliers, getSupplierById } from '../controllers/supplierController';

import { publicCache } from '../middleware/cacheControl';

const router = Router();

router.get('/', publicCache(120), getSuppliers);
router.get('/:id', publicCache(120), getSupplierById);

export default router;
