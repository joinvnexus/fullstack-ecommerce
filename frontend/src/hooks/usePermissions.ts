import { useAuth } from './useAuth';
import { ROLE_PERMISSIONS } from '@/utils/rolePermissions';

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;

    const userPermissions = ROLE_PERMISSIONS[user.role] || [];

    // Admin has all permissions
    if (userPermissions.includes('*')) return true;

    // Check for specific permission
    return userPermissions.includes(`${resource}.${action}`);
  };

  const hasAnyPermission = (permissions: Array<{ resource: string; action: string }>): boolean => {
    return permissions.some(({ resource, action }) => hasPermission(resource, action));
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const canManageUsers = (): boolean => {
    return hasPermission('users', 'update') || isAdmin();
  };

  const canManageProducts = (): boolean => {
    return hasPermission('products', 'create') ||
           hasPermission('products', 'update') ||
           hasPermission('products', 'delete');
  };

  const canViewAnalytics = (): boolean => {
    return hasPermission('analytics', 'read') || isAdmin();
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasRole,
    isAdmin,
    canManageUsers,
    canManageProducts,
    canViewAnalytics,
  };
}