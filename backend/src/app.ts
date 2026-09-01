import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import { doubleCsrf } from "csrf-csrf";
import logger from "./utils/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payments.js";
import adminRoutes from './routes/admin.js';
import wishlistRoutes from './routes/wishlist.js';
import searchRoutes from './routes/search.js';
import { createRateLimiter } from "./services/rateLimiter.js";

const app = express();

// ------------------- Middlewares -------------------
app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser());

// Raw body parser for Stripe webhook (must come before express.json to preserve raw body for signature verification)
app.use('/api/payments/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data sanitization — removes $ and . from req.body, req.query, req.params (NoSQL injection prevention)
app.use(mongoSanitize());
// Data sanitization — sanitizes user input against XSS
app.use(xss());

// CSRF Protection — Double Submit Cookie Pattern (stateless, no session required)
const csrfSecret = process.env.CSRF_SECRET;
if (!csrfSecret) {
    logger.warn('CSRF_SECRET not set — using insecure fallback. Set CSRF_SECRET in production.');
}

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
    getSecret: () => csrfSecret || 'dev-csrf-secret-change-in-production',
    cookieName: process.env.NODE_ENV === 'production' ? '__Host-x-csrf-token' : 'x-csrf-token',
    cookieOptions: {
        sameSite: 'strict',
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    },
    getSessionIdentifier: (req) => req.ip || req.socket.remoteAddress || 'unknown',
    getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'] as string | undefined,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    skipCsrfProtection: (req) => req.path.startsWith('/api/payments/stripe/webhook'),
});

// CSRF middleware (protects all non-safe methods except skipped routes)
app.use(doubleCsrfProtection);

// Rate limiting
app.use(createRateLimiter());

// ------------------- Routes -------------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/search", searchRoutes);

// ------------------- Health & CSRF Token -------------------
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        service: "Ecommerce API"
    });
});

// CSRF token endpoint — frontend calls this to get a token for POST/PUT/DELETE requests
// Registered before the main middleware chain so it can issue tokens
app.get("/api/csrf-token", (req, res) => {
    const csrfToken = generateCsrfToken(req, res);
    res.json({ csrfToken });
});

// Debug endpoint — restricted to development only
if (process.env.NODE_ENV === 'development') {
    app.get("/api/test", (req, res) => {
        res.json({
            message: "API is working!",
            endpoints: {
                auth: ["POST /register", "POST /login", "GET /me"],
                products: ["GET /", "GET /:slug", "GET /category/:categorySlug"]
            }
        });
    });
}

// 404 handler
app.use((req, res) => res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
}));

// Error handler
app.use(errorHandler);

export default app;
