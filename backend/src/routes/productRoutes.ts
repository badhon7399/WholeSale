import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';
import { createProductValidation, mongoIdValidation } from '../middleware/validate';

import { publicCache } from '../middleware/cacheControl';

const router = Router();

router.get('/', publicCache(60), getProducts);
router.get('/:id', mongoIdValidation, publicCache(60), getProductById);
router.post('/', authenticate, authorize(['supplier']), createProductValidation, createProduct);
router.put('/:id', authenticate, authorize(['supplier']), mongoIdValidation, updateProduct);
router.delete('/:id', authenticate, authorize(['supplier']), mongoIdValidation, deleteProduct);

export default router;
