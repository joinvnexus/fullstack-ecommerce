import axios, { AxiosError } from 'axios';
import { PaginatedResponse, Product, Category, User, Cart, Order, LoginCredentials, RegisterData, UpdateProfileData, ChangePasswordData, AddressData, AddToCartData, UpdateCartItemData, CreateOrderData, SearchParams, AutocompleteParams } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// CSRF token — stored in memory only (NOT localStorage — XSS vulnerable)
let csrfToken: string | null = null;

export const fetchCsrfToken = async (): Promise<string> => {
  if (csrfToken) return csrfToken;
  try {
    const response = await axios.get(`${API_URL}/csrf-token`, {
      withCredentials: true,
    });
    csrfToken = response.data.csrfToken;
    return csrfToken ?? '';
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return '';
  }
};

export const clearCsrfToken = (): void => {
  csrfToken = null;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor — attach CSRF token to unsafe methods
const unsafeMethods = ['post', 'put', 'delete', 'patch'];
api.interceptors.request.use((config) => {
  if (csrfToken && unsafeMethods.includes(config.method || '')) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    // Handle CSRF token expiry — refetch and retry once
    if (
      error.response?.status === 403 &&
      error.config &&
      !(error.config as any).__isRetry
    ) {
      try {
        await fetchCsrfToken();
        (error.config as any).__isRetry = true;
        error.config.headers['X-CSRF-Token'] = csrfToken;
        return api(error.config);
      } catch {
        // Fall through to normal error handling
      }
    }

    // Ignore aborted requests
    if (error.name === 'AbortError' || error.message === 'canceled') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // Don't redirect for auth/me since it's expected when not logged in
      if (error.config?.url?.includes('/auth/me')) {
        return Promise.reject(error);
      }
      // Redirect to login
      window.location.href = '/login';
    }

    const errorData = error.response?.data as Record<string, unknown>;
    const message = (typeof errorData?.message === 'string' ? errorData.message : error.message) || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth API
export const authApi = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginCredentials) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data: UpdateProfileData) => api.put('/auth/me', data),
  changePassword: (data: ChangePasswordData) => api.put('/auth/password', data),
  getAddresses: () => api.get('/auth/addresses'),
  addAddress: (data: AddressData) => api.post('/auth/me/address', data),
  updateAddress: (index: number, data: AddressData) => api.put(`/auth/addresses/${index}`, data),
  deleteAddress: (index: number) => api.delete(`/auth/me/address/${index}`),
  // Password reset
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) => api.post('/auth/reset-password', { token, newPassword }),
};

// Products API
export const productsApi = {
  getAll: (params?: Record<string, unknown>): Promise<PaginatedResponse<Product>> => api.get('/products', { params }),
  getBySlug: (slug: string) => api.get<{ product: Product; relatedProducts: Product[] }>(`/products/${slug}`),
  getByCategory: (categorySlug: string, params?: Record<string, unknown>) => api.get<PaginatedResponse<Product>>(`/products/category/${categorySlug}`, { params }),
  getRecommendations: (productId: string) => api.get(`/products/${productId}/recommendations`),
};

// Categories API
export const categoriesApi = {
  getAll: (): Promise<{ data: Category[] }> => api.get('/categories'),
  getBySlug: (slug: string) => api.get<Category>(`/categories/${slug}`),
};

// Cart API
export const cartApi = {
  getCart: (guestId?: string) => api.get('/cart', { params: { guestId } }),
  addItem: (data: AddToCartData) => api.post('/cart/items', data),
  updateItem: (itemId: string, data: UpdateCartItemData) => api.put(`/cart/items/${itemId}`, data),
  removeItem: (itemId: string, guestId?: string) => 
    api.delete(`/cart/items/${itemId}`, { params: { guestId } }),
  clearCart: (guestId?: string) => api.delete('/cart', { params: { guestId } }),
  mergeCart: (data: { guestId: string }) => api.post('/cart/merge', data),
};

// Orders API
export const ordersApi = {
  create: (data: CreateOrderData) => api.post<Order>('/orders', data),
  getMyOrders: (params?: Record<string, unknown>) => api.get<PaginatedResponse<Order>>('/orders/my-orders', { params }),
  getOrder: (id: string) => api.get<Order>(`/orders/${id}`),
};

// Payments API
export const paymentsApi = {
  createStripeIntent: (data: { orderId: string; amount: number }) => api.post('/payments/stripe/intent', data),
  getPaymentStatus: (orderId: string) => api.get(`/payments/${orderId}/status`),
  getPaymentMethods: () => api.get('/payments/methods'),
  processRefund: (orderId: string, data: { amount: number; reason?: string }) => api.post(`/payments/${orderId}/refund`, data),
  createBkashPayment: (data: { amount: number; orderId: string }) => api.post('/payments/bkash/create', data),
  executeBkashPayment: (data: { paymentId: string }) => api.post('/payments/bkash/execute', data),
  initializeNagadPayment: (data: { amount: number; orderId: string }) => api.post('/payments/nagad/initialize', data),
  verifyNagadPayment: (data: { paymentRef: string }) => api.post('/payments/nagad/verify', data),
};

// Wishlist API
export const wishlistApi = {
  getWishlists: () => api.get('/wishlist'),
  getDefaultWishlist: () => api.get('/wishlist/default'),
  createWishlist: (data: { name: string }) => api.post('/wishlist', data),
  getWishlist: (wishlistId: string) => api.get(`/wishlist/${wishlistId}`),
  updateWishlist: (wishlistId: string, data: { name: string }) => api.put(`/wishlist/${wishlistId}`, data),
  deleteWishlist: (wishlistId: string) => api.delete(`/wishlist/${wishlistId}`),
  addToWishlist: (wishlistId: string, data: { productId: string; notes?: string }) =>
    api.post(`/wishlist/${wishlistId}/items`, data),
  removeFromWishlist: (wishlistId: string, productId: string) => 
    api.delete(`/wishlist/${wishlistId}/items/${productId}`),
  moveItem: (data: { fromWishlistId: string; toWishlistId: string; productId: string }) => api.post('/wishlist/move-item', data),
  checkProductInWishlist: (productId: string) => api.get(`/wishlist/check/${productId}`),
};

// Search API
export const searchApi = {
  searchProducts: (params: SearchParams, config?: Record<string, unknown>) => api.get('/search/products', { params, ...config }),
  autocomplete: (params: AutocompleteParams, config?: Record<string, unknown>) => api.get('/search/autocomplete', { params, ...config }),
  getSuggestions: (params: { query: string }, config?: Record<string, unknown>) => api.get('/search/suggestions', { params, ...config }),
  getPopularSearches: (params?: Record<string, unknown>, config?: Record<string, unknown>) => api.get('/search/popular', { params, ...config }),
  getTrendingProducts: (params?: Record<string, unknown>, config?: Record<string, unknown>) => api.get('/search/trending', { params, ...config }),
  searchCategory: (categorySlug: string, params?: Record<string, unknown>, config?: Record<string, unknown>) =>
    api.get(`/search/category/${categorySlug}`, { params, ...config }),
  advancedSearch: (data: Record<string, unknown>, config?: Record<string, unknown>) => api.post('/search/advanced', data, config),
};
export default api;