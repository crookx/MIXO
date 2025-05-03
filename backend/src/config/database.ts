import mongoose from 'mongoose';
import { Config, config } from './config';
import { logger } from '../utils/logger';

interface DatabaseOptions extends mongoose.ConnectOptions {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
  autoIndex: boolean;
  serverSelectionTimeoutMS: number;
  socketTimeoutMS: number;
}

const options: DatabaseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
};

export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoUri, options);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    logger.info(`Database: ${conn.connection.name}`);
    logger.info(`Environment: ${config.nodeEnv}`);

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('connected', () => {
      logger.info('MongoDB reconnected successfully');
    });

  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
};

// Graceful shutdown handler
export const handleDatabaseShutdown = async (): Promise<void> => {
  try {
    await closeDatabase();
  } catch (error) {
    logger.error('Error during database shutdown:', error);
    process.exit(1);
  }
};