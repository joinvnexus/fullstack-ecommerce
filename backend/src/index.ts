import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
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
import { swaggerUi, specs } from './utils/swagger.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    // Use user ID if authenticated, otherwise IP
    const user = (req as any).user;
    return user ? `user_${user.userId}` : (req.ip || req.connection.remoteAddress || 'unknown');
  },
  skip: (req, res) => {
    // Skip rate limiting for health check and test endpoints
    return req.path === '/api/health' || req.path === '/api/test';
  }
});
app.use(limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_APP_URL
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/api/auth", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/search', searchRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Ecommerce API",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    routers: [
      "/api/auth",
      "/api/products",
      "/api/categories",
      "/api/cart",
      "/api/orders",
      "/api/payments",
      "/api/admin",
      "/api/wishlist",
    ],
  });
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working!",
    models: ["User", "Product", "Category", "Cart", "Order"],
    endpoints: {
      auth: ["POST /register", "POST /login", "GET /me"],
      products: ["GET /", "GET /:slug", "GET /category/:categorySlug"],
      categories: ["GET /", "GET /:slug"],
      cart: ["GET /", "POST /items", "PUT /items/:id", "DELETE /items/:id"],
      orders: ["POST /", "GET /my-orders", "GET /:id"],
      payments: ["POST /process", "GET /methods"],
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler (must be last middleware)
app.use(errorHandler);

// Database connection
const buildMongoURI = () => {
  const user = process.env.MONGODB_USER;
  const pass = process.env.MONGODB_PASS;
  const host = process.env.MONGODB_HOST;
  const db = process.env.MONGODB_DB;
  return `mongodb+srv://${user}:${pass}@${host}/${db}?retryWrites=true&w=majority`;
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(buildMongoURI());
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    logger.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
    logger.info(`📡 Health check: http://localhost:${PORT}/api/health`);
    logger.info(`🔧 Test endpoint: http://localhost:${PORT}/api/test`);
    logger.info(`🔐 Auth endpoints:`);
    logger.info(`   POST http://localhost:${PORT}/api/auth/register`);
    logger.info(`   POST http://localhost:${PORT}/api/auth/login`);
    logger.info(`   GET  http://localhost:${PORT}/api/auth/me (requires auth)`);
  });
};

startServer();

// Export for testing
export default app;