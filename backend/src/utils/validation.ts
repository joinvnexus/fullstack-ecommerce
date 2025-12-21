import { z, ZodError } from 'zod';
import type { ZodSchema, ZodIssue } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
});

// Address validation schema
export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  isDefault: z.boolean().optional(),
});

// Product validation schemas
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

// Cart validation schemas
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

// Validation middleware
export const validate = (schema: ZodSchema<any>) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: ZodIssue) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        res.status(400).json({ message: 'Validation failed', errors });
      } else {
        res.status(400).json({ message: 'Invalid request' });
      }
    }
  };
};
