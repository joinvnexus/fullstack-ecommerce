import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const buildMongoURI = () => {
  const user = process.env.MONGODB_USER;
  const pass = process.env.MONGODB_PASS;
  const host = process.env.MONGODB_HOST;
  const db = process.env.MONGODB_DB;
  return `mongodb+srv://${user}:${pass}@${host}/${db}?retryWrites=true&w=majority`;
};

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(buildMongoURI());
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    logger.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
