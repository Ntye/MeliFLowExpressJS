import { Response } from 'express';

/**
 * Standard success response format
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Standard error response format
 */
export interface ErrorResponse {
  success: false;
  error: string;
  statusCode: number;
  details?: any;
}

/**
 * Send standardized success response
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): Response {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(response);
}

/**
 * Send standardized error response
 */
export function sendError(
  res: Response,
  error: string,
  statusCode = 500,
  details?: any
): Response {
  const response: ErrorResponse = {
    success: false,
    error,
    statusCode,
    details,
  };
  return res.status(statusCode).json(response);
}
