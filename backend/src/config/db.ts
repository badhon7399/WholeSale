import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

const connectDB = async (retryCount = 0): Promise<void> => {
  try {
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    logger.info('✅ MongoDB Connected Successfully!');
  } catch (error) {
    logger.error(`❌ MongoDB connection attempt ${retryCount + 1} failed:`, error);

    if (retryCount < MAX_RETRIES - 1) {
      logger.info(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(retryCount + 1);
    }

    logger.error(`Failed to connect after ${MAX_RETRIES} attempts. Exiting.`);
    process.exit(1);
  }
};

// Connection event listeners
mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('✅ MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error('❌ MongoDB connection error:', err);
});

export default connectDB;
