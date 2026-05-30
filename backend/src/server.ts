import app from './app';
import { env } from './config/env';
import connectDB from './config/db';
import { logger } from './utils/logger';

// Connect Database
connectDB();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server running on port ${env.PORT} [${env.NODE_ENV}]`);
});

const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
