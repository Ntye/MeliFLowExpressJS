import createApp from './app';
import environment from './config/environment';
import { testConnection } from './config/database';
import logger from './utils/logger';
import './models'; // Import models to set up associations

/**
 * Start the Express server
 */
async function startServer() {
  try {
    // Test database connection
    await testConnection();
    logger.info('Database connection verified');

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(environment.port, environment.host, () => {
      logger.info(`Server is running on http://${environment.host}:${environment.port}`);
      logger.info(`Environment: ${environment.nodeEnv}`);
      logger.info('API endpoints:');
      logger.info('  - GET  /api/health');
      logger.info('  - GET  /api/status');
      logger.info('  - POST /api/ruches');
      logger.info('  - GET  /api/ruches');
      logger.info('  - GET  /api/ruches/:id');
      logger.info('  - PUT  /api/ruches/:id');
      logger.info('  - DELETE /api/ruches/:id');
      logger.info('  - POST /api/ruches/:id/measurements');
      logger.info('  - GET  /api/ruches/:id/measurements');
      logger.info('  - GET  /api/ruches/:id/measurements/latest');
      logger.info('  - GET  /api/ruches/:id/analytics/gain');
      logger.info('  - GET  /api/ruches/:id/analytics/compare');
      logger.info('  - POST /api/ruchers');
      logger.info('  - GET  /api/ruchers');
      logger.info('  - GET  /api/ruchers/:id');
      logger.info('  - PUT  /api/ruchers/:id');
      logger.info('  - DELETE /api/ruchers/:id');
      logger.info('  - GET  /api/ruchers/:id/ruches');
      logger.info('  - PATCH /api/ruchers/:id/ruches/:ruche_id');
      logger.info('  - GET  /api/ruchers/:id/stats');
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Closing server gracefully...`);
      server.close(async () => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
