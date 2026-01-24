import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
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
    origin: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_APP_URL : true,
    credentials: true 
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// ------------------- Health & Test -------------------
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        service: "Ecommerce API"
    });
});

app.get("/api/test", (req, res) => {
    res.json({
        message: "API is working!",
        endpoints: {
            auth: ["POST /register", "POST /login", "GET /me"],
            products: ["GET /", "GET /:slug", "GET /category/:categorySlug"]
        }
    });
});

// 404 handler
app.use((req, res) => res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
}));

// Error handler
app.use(errorHandler);

export default app;
