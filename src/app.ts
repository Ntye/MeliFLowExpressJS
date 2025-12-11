import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/environment';
import { requestLogger } from './middleware/logging';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import routes from './routes';
import { logger } from './utils/logger';

const app: Application = express();

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API status endpoint
app.get('/status', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    name: 'MeliFlow API',
    version: config.app.apiVersion,
    environment: config.app.env,
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use(`/api/${config.app.apiVersion}`, routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
