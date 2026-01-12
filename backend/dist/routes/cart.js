import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { authenticate } from "../utils/auth.js";
import { validate } from "../utils/validation.js";
import { addToCartSchema } from "../utils/validation.js";
import { AppError } from "../middleware/errorHandler.js";
import mongoose from "mongoose";
const router = express.Router();
// Helper function to get or create cart
const getOrCreateCart = async (userId, guestId) => {
    let cart;
    if (userId) {
        // User cart
        cart = await Cart.findOne({ userId });
    }
    else if (guestId) {
        // Guest cart
        cart = await Cart.findOne({ guestId });
    }
    if (!cart) {
        cart = new Cart({
            userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
            guestId: guestId || undefined,
            items: [],
            subtotal: 0,
            discount: 0,
            tax: 0,
            shipping: 0,
            total: 0,
            currency: "USD",
        });
        await cart.save();
    }
    return cart;
};
// Get cart (authenticated or guest)
router.get("/", authenticate, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        // Remove guestId for authenticated users
        const guestId = undefined;
        if (!userId && !guestId) {
            throw new AppError("User ID or Guest ID required", 400);
        }
        const cart = await getOrCreateCart(userId, guestId);
        // Populate product details
        const populatedCart = await cart.populate({
            path: "items.productId",
            select: "title slug images price stock status",
        });
        res.json({
            success: true,
            data: populatedCart,
        });
    }
    catch (error) {
        next(error);
    }
});
// Add item to cart
router.post("/items", authenticate, validate(addToCartSchema), async (req, res, next) => {
    try {
        const { productId, variantId, quantity } = req.body;
        const userId = req.user.userId;
        // Remove guestId for authenticated users
        const guestId = undefined;
        if (!userId && !guestId) {
            throw new AppError("User ID or Guest ID required", 400);
        }
        // Get product
        const product = await Product.findById(productId);
        if (!product) {
            throw new AppError("Product not found", 404);
        }
        if (product.status !== "active") {
            throw new AppError("Product is not available", 400);
        }
        if (product.stock < quantity) {
            throw new AppError("Insufficient stock", 400);
        }
        // Calculate price
        let unitPrice = product.price.amount;
        let variantName = "";
        if (variantId) {
            // Find variant and adjust price
            for (const variant of product.variants) {
                const option = variant.options.find((opt) => opt._id?.toString() === variantId);
                if (option) {
                    unitPrice += option.priceAdjustment;
                    variantName = `${variant.name}: ${option.name}`;
                    break;
                }
            }
        }
        const cart = await getOrCreateCart(userId, guestId);
        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId &&
            item.variantId?.toString() === variantId);
        if (existingItemIndex > -1) {
            // Update quantity
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            if (product.stock < newQuantity) {
                throw new AppError("Insufficient stock for this quantity", 400);
            }
            cart.items[existingItemIndex].quantity = newQuantity;
            cart.items[existingItemIndex].addedAt = new Date();
        }
        else {
            // Add new item
            cart.items.push({
                productId: new mongoose.Types.ObjectId(productId),
                variantId: variantId, // if variantId is required in your interface
                quantity,
                unitPrice: product.price.amount, // assuming product.price.amount is the price at time
                addedAt: new Date(),
            });
        }
        await cart.save();
        // Populate product details
        await cart.populate({
            path: "items.productId",
            select: "title slug images price stock",
        });
        res.json({
            success: true,
            message: "Item added to cart",
            data: cart,
        });
    }
    catch (error) {
        next(error);
    }
});
// Update cart item quantity
router.put("/items/:itemId", authenticate, async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const userId = req.user.userId;
        // Remove guestId for authenticated users
        const guestId = undefined;
        if (!userId && !guestId) {
            throw new AppError("User ID or Guest ID required", 400);
        }
        if (quantity < 1) {
            throw new AppError("Quantity must be at least 1", 400);
        }
        const cart = await getOrCreateCart(userId, guestId);
        // Find item in cart
        const itemIndex = cart.items.findIndex((item) => item._id?.toString() === itemId);
        if (itemIndex === -1) {
            throw new AppError("Item not found in cart", 404);
        }
        // Get product to check stock
        const product = await Product.findById(cart.items[itemIndex].productId);
        if (!product) {
            throw new AppError("Product not found", 404);
        }
        if (product.stock < quantity) {
            throw new AppError("Insufficient stock", 400);
        }
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].addedAt = new Date();
        await cart.save();
        // Populate product details
        await cart.populate({
            path: "items.productId",
            select: "title slug images price stock",
        });
        res.json({
            success: true,
            message: "Cart item updated",
            data: cart,
        });
    }
    catch (error) {
        next(error);
    }
});
// Remove item from cart
router.delete("/items/:itemId", authenticate, async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const userId = req.user.userId;
        // Remove guestId for authenticated users
        const guestId = undefined;
        if (!userId && !guestId) {
            throw new AppError("User ID or Guest ID required", 400);
        }
        const cart = await getOrCreateCart(userId, guestId);
        // Remove item from cart
        const initialLength = cart.items.length;
        cart.items = cart.items.filter((item) => item._id?.toString() !== itemId);
        if (cart.items.length === initialLength) {
            throw new AppError("Item not found in cart", 404);
        }
        await cart.save();
        // Populate product details
        await cart.populate({
            path: "items.productId",
            select: "title slug images price stock",
        });
        res.json({
            success: true,
            message: "Item removed from cart",
            data: cart,
        });
    }
    catch (error) {
        next(error);
    }
});
// Clear cart
router.delete("/", authenticate, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        // Remove guestId for authenticated users
        const guestId = undefined;
        if (!userId && !guestId) {
            throw new AppError("User ID or Guest ID required", 400);
        }
        const cart = await getOrCreateCart(userId, guestId);
        cart.items = [];
        await cart.save();
        res.json({
            success: true,
            message: "Cart cleared",
            data: cart,
        });
    }
    catch (error) {
        next(error);
    }
});
// Merge guest cart with user cart (on login)
router.post("/merge", authenticate, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { guestId } = req.body;
        if (!guestId) {
            throw new AppError("Guest ID required", 400);
        }
        // Get user cart and guest cart
        const [userCart, guestCart] = await Promise.all([
            getOrCreateCart(userId, undefined),
            getOrCreateCart(undefined, guestId),
        ]);
        // If guest cart has items, merge them
        if (guestCart.items.length > 0) {
            // Merge logic: combine quantities for same items
            guestCart.items.forEach((guestItem) => {
                const existingItemIndex = userCart.items.findIndex((userItem) => userItem.productId.toString() === guestItem.productId.toString() &&
                    userItem.variantId?.toString() === guestItem.variantId?.toString());
                if (existingItemIndex > -1) {
                    // Merge quantities
                    userCart.items[existingItemIndex].quantity += guestItem.quantity;
                }
                else {
                    // Add new item
                    userCart.items.push(guestItem);
                }
            });
            await userCart.save();
            // Delete guest cart
            await Cart.deleteOne({ guestId });
            // Populate product details
            await userCart.populate({
                path: "items.productId",
                select: "title slug images price stock",
            });
            res.json({
                success: true,
                message: "Carts merged successfully",
                data: userCart,
            });
        }
        else {
            res.json({
                success: true,
                message: "No items to merge",
                data: userCart,
            });
        }
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=cart.js.map