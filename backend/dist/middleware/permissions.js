import { hasPermission } from '../utils/rolePermissions.js';
import { AppError } from './errorHandler.js';
// Middleware to check specific permission
export const checkPermission = (resource, action) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }
        // Check if user has the required permission
        if (!hasPermission(user.role, resource, action)) {
            res.status(403).json({
                message: 'Insufficient permissions',
                required: `${resource}.${action}`,
                role: user.role
            });
            return;
        }
        next();
    };
};
// Middleware to check multiple permissions (OR condition)
export const checkAnyPermission = (permissions) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }
        // Check if user has any of the required permissions
        const hasAnyPermission = permissions.some(({ resource, action }) => hasPermission(user.role, resource, action));
        if (!hasAnyPermission) {
            res.status(403).json({
                message: 'Insufficient permissions',
                required: permissions.map(p => `${p.resource}.${p.action}`),
                role: user.role
            });
            return;
        }
        next();
    };
};
// Middleware to check admin role only (backward compatibility)
export const requireAdmin = (req, res, next) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }
    if (user.role !== 'admin') {
        res.status(403).json({ message: 'Admin access required' });
        return;
    }
    next();
};
// Helper function to validate role
export const validateRole = (role) => {
    const validRoles = ['customer', 'admin', 'manager', 'support', 'vendor'];
    return validRoles.includes(role);
};
// Middleware to validate role changes
export const validateRoleChange = (req, res, next) => {
    const { role } = req.body;
    if (!role) {
        res.status(400).json({ message: 'Role is required' });
        return;
    }
    if (!validateRole(role)) {
        res.status(400).json({
            message: 'Invalid role',
            validRoles: ['customer', 'admin', 'manager', 'support', 'vendor']
        });
        return;
    }
    next();
};
//# sourceMappingURL=permissions.js.map