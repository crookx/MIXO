import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/config';
import { IUser } from '../models/User';
import ms from 'ms'; // Add ms import for time string parsing

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: IUser): string => {
  const payload = {
    id: user._id.toString(), // Convert ObjectId to string
    email: user.email,
    role: user.role
  };

  // Define the expiration time using a properly typed value
  const expiresIn = typeof config.jwt.expiresIn === 'string' 
    ? config.jwt.expiresIn // Already a valid format like '24h', '7d'
    : String(ms(Number(config.jwt.expiresIn))); // Convert to string format

  const options: SignOptions = {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn']
  };

  return jwt.sign(
    payload,
    config.jwt.secret as Secret,
    options
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.jwt.secret);
};

export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashResetToken = (token: string): string => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

export const sanitizeUser = (user: IUser) => {
  const { password, resetPasswordToken, resetPasswordExpires, ...sanitizedUser } = user.toObject();
  return sanitizedUser;
};