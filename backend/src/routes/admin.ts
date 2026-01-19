import express from 'express';
import { authenticate } from '../utils/auth.js';
import { checkPermission, requireAdmin, validateRole, validateRoleChange } from '../middleware/permissions.js';

// Import controllers
import * as dashboardController from '../controllers/admin/dashboardController.js';
import * as productController from '../controllers/admin/productController.js';
import * as ordersController from '../controllers/admin/ordersController.js';
import * as usersController from '../controllers/admin/usersController.js';
import * as categoryController from '../controllers/admin/categoryController.js';

const router = express.Router();

// All admin routes require authentication
router.use(authenticate);

// Dashboard routes
router.get('/dashboard/stats', checkPermission('analytics', 'read'), dashboardController.getDashboardStats);

// Product routes
router.get('/products', checkPermission('products', 'read'), productController.getProducts);
router.get('/products/:id', checkPermission('products', 'read'), productController.getProduct);
router.post('/products', checkPermission('products', 'create'), productController.createProduct);
router.put('/products/:id', checkPermission('products', 'update'), productController.updateProduct);
router.delete('/products/:id', checkPermission('products', 'delete'), productController.deleteProduct);
router.post('/products/bulk', checkPermission('products', 'update'), productController.bulkUpdateProducts);

// Order routes
router.get('/orders', checkPermission('orders', 'read'), ordersController.getOrders);
router.get('/orders/:id', checkPermission('orders', 'read'), ordersController.getOrder);
router.put('/orders/:id/status', checkPermission('orders', 'update'), ordersController.updateOrderStatus);
router.post('/orders/bulk-status', checkPermission('orders', 'update'), ordersController.bulkUpdateOrderStatus);

// Category routes
router.get('/categories', checkPermission('products', 'read'), categoryController.getCategories);
router.get('/categories/:id', checkPermission('products', 'read'), categoryController.getCategory);
router.post('/categories', checkPermission('products', 'create'), categoryController.createCategory);
router.put('/categories/:id', checkPermission('products', 'update'), categoryController.updateCategory);
router.delete('/categories/:id', checkPermission('products', 'delete'), categoryController.deleteCategory);

// User management
router.get('/users', checkPermission('customers', 'read'), usersController.getUsers);
router.patch('/users/:id/role', requireAdmin, validateRoleChange, usersController.updateUserRole);

// Audit logs (admin only)
router.get('/audit', requireAdmin, async (req, res) => {
  // TODO: Create auditController for audit log viewing
  res.json({ message: 'Audit logs - TODO: implement auditController' });
});

export default router;