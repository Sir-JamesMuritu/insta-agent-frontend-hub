"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./config/logger"));
const services_1 = require("./services");
const app_1 = __importDefault(require("./app"));
const index_1 = require("./Agent/index");
dotenv_1.default.config();
async function startServer() {
    try {
        await (0, index_1.initAgent)();
    }
    catch (err) {
        logger_1.default.error("Error during agent initialization:", err);
        process.exit(1);
    }
    const server = app_1.default.listen(process.env.PORT || 3000, () => {
        logger_1.default.info(`Server is running on port ${process.env.PORT || 3000}`);
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
startServer();
