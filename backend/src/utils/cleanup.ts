import mongoose from 'mongoose';
import { logger } from './logger';

export class DatabaseCleanup {
  private static timers: NodeJS.Timeout[] = [];
  private static sessions: mongoose.ClientSession[] = [];

  static registerTimer(timer: NodeJS.Timeout): void {
    this.timers.push(timer);
  }

  static registerSession(session: mongoose.ClientSession): void {
    this.sessions.push(session);
  }

  static async cleanup(): Promise<void> {
    // Clear all timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];

    // Abort and end all sessions
    await Promise.all(
      this.sessions.map(async session => {
        try {
          await session.abortTransaction();
          await session.endSession();
        } catch (error) {
          logger.error('Error cleaning up session:', error);
        }
      })
    );
    this.sessions = [];
  }
}

export const withTransaction = async <T>(
  operation: (session: mongoose.ClientSession) => Promise<T>
): Promise<T> => {
  const session = await mongoose.startSession();
  DatabaseCleanup.registerSession(session);
  
  try {
    session.startTransaction();
    const result = await operation(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};