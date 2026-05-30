import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized environment variable validation.
 * Throws at startup if any required variable is missing,
 * preventing the app from running with insecure defaults.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

export const env = {
  // Server
  PORT: parseInt(optionalEnv('PORT', '5000'), 10),
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),

  // Database
  MONGODB_URI: requireEnv('MONGODB_URI'),

  // Auth
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: optionalEnv('JWT_EXPIRES_IN', '7d'),

  // CORS
  CORS_ORIGINS: optionalEnv('CORS_ORIGINS', 'http://localhost:3000'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: optionalEnv('CLOUDINARY_CLOUD_NAME', ''),
  CLOUDINARY_API_KEY: optionalEnv('CLOUDINARY_API_KEY', ''),
  CLOUDINARY_API_SECRET: optionalEnv('CLOUDINARY_API_SECRET', ''),
  CLOUDINARY_URL: optionalEnv('CLOUDINARY_URL', ''),

  // Derived
  get isProduction(): boolean {
    return this.NODE_ENV === 'production';
  },

  get isCloudinaryConfigured(): boolean {
    return !!(
      this.CLOUDINARY_URL ||
      (this.CLOUDINARY_CLOUD_NAME && this.CLOUDINARY_API_KEY && this.CLOUDINARY_API_SECRET)
    );
  },
} as const;
