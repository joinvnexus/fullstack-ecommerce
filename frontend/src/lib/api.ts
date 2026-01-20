import axios from 'axios';
import { PaginatedResponse, Product, Category } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Ignore aborted requests
    if (error.name === 'AbortError' || error.message === 'canceled') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }

    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth API
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/me', data),
  changePassword: (data: any) => api.put('/auth/password', data),
  getAddresses: () => api.get('/auth/addresses'),
  addAddress: (data: any) => api.post('/auth/me/address', data),
  updateAddress: (index: number, data: any) => api.put(`/auth/addresses/${index}`, data),
  deleteAddress: (index: number) => api.delete(`/auth/me/address/${index}`),
};

// Products API
export const productsApi = {
  getAll: (params?: any): Promise<PaginatedResponse<Product>> => api.get('/products', { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  getByCategory: (categorySlug: string, params?: any) => api.get(`/products/category/${categorySlug}`, { params }),
};

// Categories API
export const categoriesApi = {
  getAll: (): Promise<{ data: Category[] }> => api.get('/categories'),
  getBySlug: (slug: string) => api.get(`/categories/${slug}`),
};

// Cart API
export const cartApi = {
  getCart: (guestId?: string) => api.get('/cart', { params: { guestId } }),
  addItem: (data: any) => api.post('/cart/items', data),
  updateItem: (itemId: string, data: any) => api.put(`/cart/items/${itemId}`, data),
  removeItem: (itemId: string, guestId?: string) => 
    api.delete(`/cart/items/${itemId}`, { params: { guestId } }),
  clearCart: (guestId?: string) => api.delete('/cart', { params: { guestId } }),
  mergeCart: (data: any) => api.post('/cart/merge', data),
};

// Orders API
export const ordersApi = {
  create: (data: any) => api.post('/orders', data),
  getMyOrders: (params?: any) => api.get('/orders/my-orders', { params }),
  getOrder: (id: string) => api.get(`/orders/${id}`),
};

// Payments API
export const paymentsApi = {
  createStripeIntent: (data: any) => api.post('/payments/stripe/intent', data),
  getPaymentStatus: (orderId: string) => api.get(`/payments/${orderId}/status`),
  getPaymentMethods: () => api.get('/payments/methods'),
  processRefund: (orderId: string, data: any) => api.post(`/payments/${orderId}/refund`, data),
  createBkashPayment: (data: any) => api.post('/payments/bkash/create', data),
  executeBkashPayment: (data: any) => api.post('/payments/bkash/execute', data),
  initializeNagadPayment: (data: any) => api.post('/payments/nagad/initialize', data),
  verifyNagadPayment: (data: any) => api.post('/payments/nagad/verify', data),
};

// Admin API
export const adminApi = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // Products
  getAdminProducts: (params?: any) => api.get('/admin/products', { params }),
  createProduct: (data: any) => api.post('/admin/products', data),
  updateProduct: (id: string, data: any) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  bulkProductAction: (data: any) => api.post('/admin/products/bulk', data),
  
  // Orders
  getAdminOrders: (params?: any) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id: string, data: any) => api.patch(`/admin/orders/${id}/status`, data),
  
  // Users
  getAdminUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUserRole: (id: string, data: any) => api.patch(`/admin/users/${id}/role`, data),
};

// Wishlist API
export const wishlistApi = {
  getWishlists: () => api.get('/wishlist'),
  getDefaultWishlist: () => api.get('/wishlist/default'),
  createWishlist: (data: any) => api.post('/wishlist', data),
  getWishlist: (wishlistId: string) => api.get(`/wishlist/${wishlistId}`),
  updateWishlist: (wishlistId: string, data: any) => api.put(`/wishlist/${wishlistId}`, data),
  deleteWishlist: (wishlistId: string) => api.delete(`/wishlist/${wishlistId}`),
  addToWishlist: (wishlistId: string, data: any) => api.post(`/wishlist/${wishlistId}/items`, data),
  removeFromWishlist: (wishlistId: string, productId: string) => 
    api.delete(`/wishlist/${wishlistId}/items/${productId}`),
  moveItem: (data: any) => api.post('/wishlist/move-item', data),
  checkProductInWishlist: (productId: string) => api.get(`/wishlist/check/${productId}`),
};

// Search API
export const searchApi = {
  searchProducts: (params: any, config: any = {}) => api.get('/search/products', { params, ...config }),
  autocomplete: (params: any, config: any = {}) => api.get('/search/autocomplete', { params, ...config }),
  getSuggestions: (params: any, config: any = {}) => api.get('/search/suggestions', { params, ...config }),
  getPopularSearches: (params?: any, config: any = {}) => api.get('/search/popular', { params, ...config }),
  getTrendingProducts: (params?: any, config: any = {}) => api.get('/search/trending', { params, ...config }),
  searchCategory: (categorySlug: string, params?: any, config: any = {}) =>
    api.get(`/search/category/${categorySlug}`, { params, ...config }),
  advancedSearch: (data: any, config: any = {}) => api.post('/search/advanced', data, config),
};
export default api;