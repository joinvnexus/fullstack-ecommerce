# Frontend Component Patterns & Best Practices

This document outlines the recommended patterns for creating maintainable and reusable components in this project.

## 1. Functional Component Pattern

```typescript
// ✅ GOOD: Functional component with proper typing
interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether button is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

## 2. Composition Pattern

```typescript
// ✅ GOOD: Using composition for reusable card component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div className={`bg-white rounded-xl shadow-md ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`border-b pb-3 mb-3 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`border-t pt-3 mt-3 ${className}`}>{children}</div>;
}

// Usage example:
// <Card>
//   <CardHeader>Title</CardHeader>
//   <CardContent>Content goes here</CardContent>
//   <CardFooter>Actions</CardFooter>
// </Card>
```

## 3. Custom Hook Pattern

```typescript
// ✅ GOOD: Custom hook for data fetching
import { useState, useEffect, useCallback } from 'react';

interface UseFetchOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions<T> = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      onError?.(errorObj);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, execute, refetch: execute };
}
```

## 4. Context Pattern

```typescript
// ✅ GOOD: Typed context provider pattern
import { createContext, useContext, useMemo, ReactNode, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export function UserProvider({ children, initialUser = null }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);

  const value = useMemo(
    () => ({
      user,
      login: (newUser: User) => setUser(newUser),
      logout: () => setUser(null),
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
```

## 5. Slice Pattern (Zustand)

```typescript
// ✅ GOOD: Typed Zustand store pattern
import { create } from 'zustand';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const useCartStore = create<CartState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),

  clearCart: () => set({ items: [] }),
}));
```

## 6. Error Boundary Pattern

```typescript
// ✅ GOOD: Error boundary with proper types
import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught an error:', error);
    // Optionally send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Something went wrong: {this.state.error?.message}
        </div>
      );
    }
    return this.props.children;
  }
}
```

## 7. Type Exports Pattern

```typescript
// ✅ GOOD: Export types from a central location
// types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

## 8. API Client Pattern

```typescript
// ✅ GOOD: Typed API client
import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    const message = (error.response?.data as Record<string, unknown>)?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

// Typed API methods
export const userApi = {
  getProfile: () => api.get<User>('/users/profile'),
  updateProfile: (data: Partial<User>) => api.put<User>('/users/profile', data),
};

export const productApi = {
  getAll: (params?: { page?: number; limit?: number }) => 
    api.get<PaginatedResponse<Product>>('/products', { params }),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
};
```

## Directory Structure

```
frontend/src/
├── app/
│   ├── components/          # Feature components
│   │   ├── ui/             # Reusable UI components
│   │   ├── layout/         # Layout components
│   │   ├── home/           # Home page components
│   │   └── ...
│   ├── hooks/              # Custom hooks
│   └── ...
├── components/              # Shared components (if needed)
├── hooks/                   # Global hooks
├── lib/                     # Utilities and patterns
│   ├── api.ts              # API client
│   ├── hooks/              # Reusable hooks
│   └── utils.ts            # Utility functions
├── store/                   # Zustand stores
├── types/                   # TypeScript types
│   ├── index.ts
│   └── api.ts
└── utils/                   # Utility functions
```

## Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `ProductCard.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useAuth.ts`)
- **Types**: PascalCase (e.g., `User`, `ProductResponse`)
- **Files**: kebab-case (e.g., `my-component.tsx`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
