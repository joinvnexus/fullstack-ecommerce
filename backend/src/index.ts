import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/database.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(Number(PORT), "0.0.0.0", () => {
        logger.info(`🚀 Server running on http://localhost:${PORT}`);
        logger.info(`📡 Health check: http://localhost:${PORT}/api/health`);
    });
};

startServer();

