import { z } from 'zod';
import type { ZodSchema } from 'zod';
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const addressSchema: z.ZodObject<{
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    country: z.ZodString;
    zipCode: z.ZodString;
    isDefault: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const createProductSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    description: z.ZodString;
    price: z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>;
    sku: z.ZodString;
    stock: z.ZodNumber;
    category: z.ZodString;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<{
        draft: "draft";
        active: "active";
        archived: "archived";
    }>>;
}, z.core.$strip>;
export declare const addToCartSchema: z.ZodObject<{
    productId: z.ZodString;
    variantId: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
    guestId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateCartItemSchema: z.ZodObject<{
    quantity: z.ZodNumber;
    guestId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const removeFromCartSchema: z.ZodObject<{
    productId: z.ZodString;
    guestId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const validate: (schema: ZodSchema<any>) => (req: any, res: any, next: any) => void;
//# sourceMappingURL=validation.d.ts.map