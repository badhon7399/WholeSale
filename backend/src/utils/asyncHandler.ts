import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async Express route handler to automatically catch errors
 * and forward them to the Express error handler middleware.
 * Eliminates repetitive try/catch blocks in every controller.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
