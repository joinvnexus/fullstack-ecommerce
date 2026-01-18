// Role-based permissions mapping
// Format: 'resource.action' or '*' for all permissions

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  customer: [],
  admin: ['*'], // Has all permissions
  manager: [
    'products.*',
    'orders.*',
    'customers.read',
    'analytics.read'
  ],
  support: [
    'orders.read',
    'orders.update', // Can update order status
    'customers.read',
    'tickets.*' // If ticket system exists
  ],
  vendor: [
    'products.read',
    'products.update', // Can update own products
    'orders.read' // Can view related orders
  ]
};

// Helper function to check if a role has a specific permission
export const hasPermission = (role: string, resource: string, action: string): boolean => {
  const permissions = ROLE_PERMISSIONS[role] || [];

  // Admin has all permissions
  if (permissions.includes('*')) return true;

  // Check for specific permission
  const requiredPermission = `${resource}.${action}`;
  return permissions.includes(requiredPermission);
};

// Helper function to get all permissions for a role
export const getRolePermissions = (role: string): string[] => {
  return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [];
};

// Available roles (for future expansion)
export const AVAILABLE_ROLES = ['customer', 'admin', 'manager', 'support', 'vendor'];

// Permission groups for UI organization
export const PERMISSION_GROUPS = {
  products: ['products.create', 'products.read', 'products.update', 'products.delete'],
  orders: ['orders.create', 'orders.read', 'orders.update', 'orders.delete'],
  customers: ['customers.create', 'customers.read', 'customers.update', 'customers.delete'],
  analytics: ['analytics.read'],
  settings: ['settings.update']
};