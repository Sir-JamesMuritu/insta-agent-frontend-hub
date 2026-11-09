"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./config/logger"));
const services_1 = require("./services");
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
async function startServer() {
    const isDatabaseConnected = await (0, db_1.connectDB)();
    if (!isDatabaseConnected) {
        logger_1.default.warn("Starting API without database access; database-backed features are unavailable.");
    }
    const port = process.env.PORT || 3001;
    const server = app_1.default.listen(port, () => {
        logger_1.default.info(`API Server is running on port ${port}`);
        logger_1.default.info(`Health check available at http://localhost:${port}/api/health`);
    });
    process.on("SIGTERM", () => {
        logger_1.default.info("Received SIGTERM signal.");
        (0, services_1.shutdown)(server);
    });
    process.on("SIGINT", () => {
        logger_1.default.info("Received SIGINT signal.");
        (0, services_1.shutdown)(server);
    });
}
startServer().catch((error) => {
    logger_1.default.error("API server startup failed:", error);
    process.exitCode = 1;
});
