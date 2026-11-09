"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        logger_1.default.warn('MONGODB_URI is not configured; starting without database access');
        return false;
    }
    try {
        await mongoose_1.default.connect(uri);
        logger_1.default.info('MongoDB connected');
        return true;
    }
    catch (error) {
        logger_1.default.error('MongoDB connection error:', error);
        return false;
    }
};
exports.connectDB = connectDB;
