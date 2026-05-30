import { Request, Response, NextFunction } from 'express';

/**
 * Prevent any caching (for authenticated data, mutations, dynamic pages)
 */
export const noCache = (req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

/**
 * Public caching (for static metadata, public product listings, categories)
 */
export const publicCache = (seconds: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    res.setHeader('Cache-Control', `public, max-age=${seconds}`);
    next();
  };
};

/**
 * Private caching (for user-specific cached data, dashboard charts)
 */
export const privateCache = (seconds: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    res.setHeader('Cache-Control', `private, max-age=${seconds}`);
    res.setHeader('Vary', 'Cookie');
    next();
  };
};

/**
 * Add Vary: Cookie header for authenticated get requests
 */
export const varyCookie = (req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Vary', 'Cookie');
  next();
};
