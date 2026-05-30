import { Router } from 'express';
import { createOrder, getBuyerOrders, getSupplierOrders, updateOrderStatus } from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';
import { createOrderValidation, mongoIdValidation } from '../middleware/validate';

const router = Router();

router.post('/', authenticate, authorize(['buyer']), createOrderValidation, createOrder);
router.get('/buyer', authenticate, authorize(['buyer']), getBuyerOrders);
router.get('/supplier', authenticate, authorize(['supplier']), getSupplierOrders);
router.patch('/:id', authenticate, mongoIdValidation, updateOrderStatus);

export default router;
