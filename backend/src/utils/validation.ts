// ===============================
// Zod imports
// ===============================
import { z, ZodError } from 'zod';
import type { ZodSchema, ZodIssue } from 'zod';

// ===============================
// USER / AUTH VALIDATION SCHEMAS
// ===============================

// User registration validation
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(), // Optional phone number
});

// User login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Update user profile (partial update allowed)
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
});

// Change password validation
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

// ===============================
// ADDRESS VALIDATION SCHEMA
// ===============================

export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  fullName: z.string().min(2, 'Full name is required'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  phone: z.string().min(1, 'Phone is required'),
  isDefault: z.boolean().optional(), // Mark as default address
});

// ===============================
// ORDER VALIDATION SCHEMA
// (Loose validation to support
// multi-step checkout & guest users)
// ===============================

export const createOrderSchema = z.object({
  shippingAddress: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      zipCode: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().or(z.literal('')).optional(),
    })
    .optional(),

  billingAddress: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      zipCode: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().or(z.literal('')).optional(),
    })
    .optional(),

  shippingMethod: z
    .object({
      name: z.string().optional(),
      cost: z.number().optional(),
      estimatedDays: z.number().optional(),
    })
    .optional(),

  paymentMethod: z.enum(['stripe', 'bkash', 'nagad']).optional(),
  notes: z.string().optional(),
  guestId: z.string().optional(), // For guest checkout
});

// ===============================
// PRODUCT VALIDATION SCHEMA
// (Admin only)
// ===============================

export const createProductSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),

  price: z.object({
    amount: z.number().min(0, 'Price must be positive'),
    currency: z.string().default('USD'),
  }),

  sku: z.string().min(1, 'SKU is required'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),

  status: z.enum(['draft', 'active', 'archived']).default('draft'),
});

// ===============================
// CART VALIDATION SCHEMAS
// ===============================

// Add item to cart
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  guestId: z.string().optional(),
});

// Update cart item quantity
export const updateCartItemSchema = z.object({
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  guestId: z.string().optional(),
});

// Remove item from cart
export const removeFromCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  guestId: z.string().optional(),
});

// ===============================
// CUSTOM VALIDATION ERROR CLASS
// ===============================

class ValidationError extends Error {
  errors: Array<{ path: string; message: string }>;

  constructor(errors: Array<{ path: string; message: string }>) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

// ===============================
// VALIDATION MIDDLEWARE
// ===============================

export const validate = (schema: ZodSchema<any>) => {
  return (req: any, res: any, next: any) => {
    try {
      // Validate request body
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        // Format Zod errors for frontend
        const errors = error.issues.map((err: ZodIssue) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        next(new ValidationError(errors));
      } else {
        next(new Error('Invalid request'));
      }
    }
  };
};

export { ValidationError };
