import express from 'express';
import { authenticate } from '../utils/auth.js';
import { checkPermission, requireAdmin, validateRole, validateRoleChange } from '../middleware/permissions.js';

// Import controllers
import * as dashboardController from '../controllers/admin/dashboardController.js';
import * as productController from '../controllers/admin/productController.js';

const router = express.Router();

// All admin routes require authentication
router.use(authenticate);

// Dashboard routes
router.get('/dashboard/stats', checkPermission('analytics', 'read'), dashboardController.getDashboardStats);

// Product routes
router.get('/products', checkPermission('products', 'read'), productController.getProducts);
router.post('/products', checkPermission('products', 'create'), productController.createProduct);
router.put('/products/:id', checkPermission('products', 'update'), productController.updateProduct);
router.delete('/products/:id', checkPermission('products', 'delete'), productController.deleteProduct);
router.post('/products/bulk', checkPermission('products', 'update'), productController.bulkUpdateProducts);

// User management (admin only for role changes)
router.patch('/users/:id/role', requireAdmin, validateRoleChange, async (req, res) => {
  // TODO: Create userController for user management
  res.json({ message: 'User role update - TODO: implement userController' });
});

// Audit logs (admin only)
router.get('/audit', requireAdmin, async (req, res) => {
  // TODO: Create auditController for audit log viewing
  res.json({ message: 'Audit logs - TODO: implement auditController' });
});

export default router;