import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';
import sequelize from '../config/database';

/**
 * Controller for health check endpoints
 */
export class HealthController {
  /**
   * Basic health check
   * GET /api/health
   */
  health = asyncHandler(async (_req: Request, res: Response) => {
    return sendSuccess(
      res,
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      },
      'Service is healthy'
    );
  });

  /**
   * Detailed status check including database connectivity
   * GET /api/status
   */
  status = asyncHandler(async (_req: Request, res: Response) => {
    let databaseStatus = 'disconnected';
    let databaseError = null;

    try {
      await sequelize.authenticate();
      databaseStatus = 'connected';
    } catch (error: any) {
      databaseError = error.message;
    }

    const statusData = {
      status: databaseStatus === 'connected' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: databaseStatus,
        error: databaseError,
      },
      memory: process.memoryUsage(),
    };

    return sendSuccess(res, statusData, 'Status check completed');
  });
}

export default new HealthController();
