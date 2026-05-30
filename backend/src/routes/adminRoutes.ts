import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getAdminStats,
  getUsers,
  verifyUser,
  updateUserRole,
  deleteUser,
  getProducts,
  deleteProduct,
  getRfqs,
  deleteRfq,
  getOrders,
  updateOrderStatus,
  editUser,
  editProduct,
  editRfq,
  editCategory,
  deleteCategory
} from '../controllers/adminController';

const router = Router();

// Secure all admin routes with authentication and role check for 'admin'
router.use(authenticate);
router.use(authorize(['admin']));

// Global statistics route
router.get('/stats', getAdminStats);

// Users management routes
router.get('/users', getUsers);
router.put('/users/:id/verify', verifyUser);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id', editUser);
router.delete('/users/:id', deleteUser);

// Products management routes
router.get('/products', getProducts);
router.put('/products/:id', editProduct);
router.delete('/products/:id', deleteProduct);

// RFQs management routes
router.get('/rfqs', getRfqs);
router.put('/rfqs/:id', editRfq);
router.delete('/rfqs/:id', deleteRfq);

// Orders management routes
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Category admin controls
router.put('/categories/:id', editCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
