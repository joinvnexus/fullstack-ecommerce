import dotenv from "dotenv";
import process from "process";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/database.js";
import { validateEnv } from "./config/env.js";
import { closeRedisConnection } from "./config/redis.js";
import logger from "./utils/logger.js";

validateEnv();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(Number(PORT), "0.0.0.0", () => {
        logger.info(`Server running on http://localhost:${PORT}`);
        logger.info(`Health check: http://localhost:${PORT}/api/health`);
    });
};

startServer();

process.on("SIGTERM", async () => {
    logger.info("SIGTERM received, shutting down gracefully...");
    await closeRedisConnection();
    process.exit(0);
});

process.on("SIGINT", async () => {
    logger.info("SIGINT received, shutting down gracefully...");
    await closeRedisConnection();
    process.exit(0);
});

