import http from 'http';
import app from './app';
import { config } from './config/environment';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import { alertWebSocket } from './websocket/alertNotificationHandler';

// Import models to ensure associations are set up
import './models';

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('Database connected successfully');

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize WebSocket
    alertWebSocket.initialize(server);

    // Start server
    server.listen(config.app.port, () => {
      logger.info(`Server started on port ${config.app.port}`);
      logger.info(`Environment: ${config.app.env}`);
      logger.info(`API Version: ${config.app.apiVersion}`);
      logger.info(`Health check: http://localhost:${config.app.port}/health`);
      logger.info(`WebSocket: ws://localhost:${config.app.port}/ws/alerts`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
