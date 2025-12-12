import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { sendError } from '../utils/response';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode = 500, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 */
export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): Response {
  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle ApiError
  if (err instanceof ApiError) {
    return sendError(res, err.message, err.statusCode, err.details);
  }

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return sendError(res, 'Validation error', 400, err.message);
  }

  // Handle Sequelize database errors
  if (err.name === 'SequelizeDatabaseError') {
    return sendError(res, 'Database error', 500, err.message);
  }

  // Handle Sequelize foreign key constraint errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return sendError(res, 'Foreign key constraint error', 400, err.message);
  }

  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return sendError(res, 'Unique constraint error', 400, err.message);
  }

  // Default error response
  return sendError(res, 'Internal server error', 500);
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): Response {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
}
