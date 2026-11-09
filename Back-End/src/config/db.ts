import mongoose from 'mongoose';
import logger from './logger';

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    logger.warn('MONGODB_URI is not configured; starting without database access');
    return false;
  }

  try {
    await mongoose.connect(uri);
    logger.info('MongoDB connected');
    return true;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    return false;
  }
};
