import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';

import { setupErrorHandlers } from './config/logger';
import authRoutes from './routes/auth';
import agentRoutes from './routes/agents';

setupErrorHandlers();

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();

app.use(helmet({ xssFilter: true, noSniff: true }));
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '1kb' }));
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
