import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payments.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_APP_URL
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

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
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔧 Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`🔐 Auth endpoints:`);
    console.log(`   POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   GET  http://localhost:${PORT}/api/auth/me (requires auth)`);
  });
};

startServer();
