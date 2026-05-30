import { Response } from 'express';
import { env } from '../config/env';

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.isProduction, // HTTPS only in production
    sameSite: 'strict',       // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: '/',
  });
};

export const clearAuthCookie = (res: Response): void => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });
};
