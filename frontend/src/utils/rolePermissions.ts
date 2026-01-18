// Frontend role permissions mapping
// This should match the backend ROLE_PERMISSIONS

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