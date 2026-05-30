import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { logger } from '../utils/logger';

/**
 * Custom application error class with HTTP status codes.
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Production-grade error handler middleware.
 * - In development: returns full error details and stack trace.
 * - In production: returns generic messages, never leaks internals.
 * - Handles Mongoose validation/duplicate key errors gracefully.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e: any) => e.message);
    message = `Validation failed: ${errors.join(', ')}`;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(', ');
    message = `Duplicate value for field: ${field}`;
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID format: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
  }

  // Log error
  if (statusCode >= 500) {
    logger.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);
  } else {
    logger.warn(`[WARN] ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message: env.isProduction && statusCode >= 500 ? 'Internal Server Error' : message,
      ...(env.isProduction ? {} : { stack: err.stack }),
    },
  });
};
