import api from '../api';

const ADMIN_BASE = '/admin';

// Admin API client
export const adminApi = {
  // Dashboard
  dashboard: {
    getStats: () => api.get(`${ADMIN_BASE}/dashboard/stats`),
  },

  // Products
  products: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      status?: string;
      category?: string;
      search?: string;
      sort?: string;
      order?: 'asc' | 'desc';
    }) => api.get(`${ADMIN_BASE}/products`, { params }),

    getById: (id: string) => api.get(`${ADMIN_BASE}/products/${id}`),

    create: (data: any) => api.post(`${ADMIN_BASE}/products`, data),

    update: (id: string, data: any) => api.put(`${ADMIN_BASE}/products/${id}`, data),

    delete: (id: string) => api.delete(`${ADMIN_BASE}/products/${id}`),

    bulkUpdate: (data: { action: string; productIds: string[]; data?: any }) =>
      api.post(`${ADMIN_BASE}/products/bulk`, data),
  },

  // Orders
  orders: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      status?: string;
      userId?: string;
      startDate?: string;
      endDate?: string;
    }) => api.get(`${ADMIN_BASE}/orders`, { params }),

    getById: (id: string) => api.get(`${ADMIN_BASE}/orders/${id}`),

    updateStatus: (id: string, status: string) =>
      api.put(`${ADMIN_BASE}/orders/${id}/status`, { status }),

    bulkUpdateStatus: (data: { orderIds: string[]; status: string }) =>
      api.post(`${ADMIN_BASE}/orders/bulk-status`, data),
  },

  // Categories
  categories: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      parent?: string;
      search?: string;
    }) => api.get(`${ADMIN_BASE}/categories`, { params }),

    getById: (id: string) => api.get(`${ADMIN_BASE}/categories/${id}`),

    create: (data: any) => api.post(`${ADMIN_BASE}/categories`, data),

    update: (id: string, data: any) => api.put(`${ADMIN_BASE}/categories/${id}`, data),

    delete: (id: string) => api.delete(`${ADMIN_BASE}/categories/${id}`),
  },

  // Users (for customer management)
  users: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      role?: string;
      search?: string;
    }) => api.get(`${ADMIN_BASE}/users`, { params }),

    updateRole: (id: string, role: string) =>
      api.patch(`${ADMIN_BASE}/users/${id}/role`, { role }),
  },

  // Audit logs
  audit: {
    getLogs: (params?: {
      page?: number;
      limit?: number;
      adminId?: string;
      resource?: string;
      action?: string;
      startDate?: string;
      endDate?: string;
    }) => api.get(`${ADMIN_BASE}/audit`, { params }),
  },
};

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface DashboardStats {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
  };
  recentOrders: any[];
  topProducts: any[];
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  price: {
    amount: number;
    currency: string;
  };
  stock: number;
  status: string;
  category: {
    _id: string;
    name: string;
  };
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  tags?: string[];
  variants?: Array<{
    name: string;
    options: Array<{
      name: string;
      priceAdjustment: number;
      skuSuffix: string;
    }>;
  }>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  createdAt: string;
  updatedAt: string;
}