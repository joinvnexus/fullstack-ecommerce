import axios from 'axios';
import { PaginatedResponse, Product, Category } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/me', data),
  addAddress: (data: any) => api.post('/auth/me/address', data),
  deleteAddress: (index: number) => api.delete(`/auth/me/address/${index}`),
};

// Products API
export const productsApi = {
  getAll: (params?: any): Promise<PaginatedResponse<Product>> => api.get('/products', { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  getByCategory: (categorySlug: string, params?: any) =>
    api.get(`/products/category/${categorySlug}`, { params }),
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
};

export default api;