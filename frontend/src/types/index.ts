// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
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

export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
}

// Product types
export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  images: ProductImage[];
  price: {
    amount: number;
    currency: string;
  };
  originalPrice?: {
    amount: number;
    currency: string;
  };
  sku: string;
  stock: number;
  variants: ProductVariant[];
  category: Category | string;
  tags: string[];
  status: 'draft' | 'active' | 'archived';
  brand?: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  freeShipping?: boolean;
  warranty?: boolean;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  _id?: string;
  name: string;
  options: VariantOption[];
}

export interface VariantOption {
  _id?: string;
  name: string;
  priceAdjustment: number;
  skuSuffix: string;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
  children: Category[];
  treePath: string[];
  sortOrder: number;
  seoMeta?: {
    title: string;
    description: string;
    keywords: string[];
  };
  productCount?: number;
}

// Cart types
export interface CartItem {
  _id?: string;
  productId: Product | string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  addedAt: string;
}

export interface Cart {
  _id: string;
  userId?: string;
  guestId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  grandTotal: number;
  currency: string;
  updatedAt: string;
}

// Order types
export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  contactInfo: {
    email: string;
    phone: string;
  };
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    grandTotal: number;
  };
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment: {
    provider: string;
    status: string;
    amount: number;
    currency: string;
  };
  shippingMethod: {
    name: string;
    cost: number;
    estimatedDays: number;
  };
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Auth types
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