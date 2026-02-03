// API Types - Replacing `any` with proper types

import { User, Product, Category, Cart, Order } from './index';

// Auth API Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AddressData {
  label: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  isDefault?: boolean;
}

// Product API Types
export interface GetProductsParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductFilters {
  categories?: string[];
  priceRange?: { min: number; max: number };
  inStock?: boolean;
  brands?: string[];
  rating?: number;
}

// Cart API Types
export interface AddToCartData {
  productId: string;
  quantity: number;
  variantId?: string;
  guestId?: string;
}

export interface UpdateCartItemData {
  quantity: number;
  guestId?: string;
}

export interface CartResponse {
  cart: Cart;
}

// Order API Types
export interface ShippingMethod {
  name: string;
  cost: number;
  estimatedDays: number;
}

export interface CreateOrderData {
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phone: string;
    email: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  paymentMethod: string;
  shippingMethod?: ShippingMethod;
  notes?: string;
}

export interface OrderFilters {
  status?: Order['status'];
  startDate?: string;
  endDate?: string;
}

// Payment API Types
export interface StripePaymentIntent {
  clientSecret: string;
  amount: number;
}

export interface BkashPaymentData {
  amount: number;
  orderId: string;
}

export interface NagadPaymentData {
  amount: number;
  orderId: string;
}

export interface RefundData {
  amount: number;
  reason?: string;
}

// Admin API Types
export interface AdminProductData {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  sku: string;
  stock: number;
  category: string;
  images?: string[];
  variants?: Product['variants'];
  status?: Product['status'];
  tags?: string[];
}

export interface AdminOrderUpdate {
  status: Order['status'];
  trackingNumber?: string;
  notes?: string;
}

export interface AdminUserUpdate {
  role: User['role'];
  isActive?: boolean;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  productsChange: number;
  recentOrders: Order[];
  topProducts: Product[];
}

// Search API Types
export interface SearchParams {
  query?: string;
  q?: string;
  page?: number;
  limit?: number;
  filters?: ProductFilters;
}

export interface AutocompleteParams {
  query: string;
  q?: string;
  limit?: number;
}

// Wishlist API Types
export interface WishlistItemData {
  productId: string;
  notes?: string;
}

export interface MoveItemData {
  fromWishlistId: string;
  toWishlistId: string;
  productId: string;
}
