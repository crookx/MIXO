import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Define configuration schema with stricter types
const configSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().positive().default(5000),
  mongoUri: z.string().min(1).default('mongodb://localhost:27017/mixo'),
  jwt: z.object({
    secret: z.string().min(32),
    expiresIn: z.string().default('24h'),
    refreshExpiresIn: z.string().default('7d')
  }),
  mpesa: z.object({
    consumerKey: z.string().min(1),
    consumerSecret: z.string().min(1),
    shortcode: z.string().min(1),
    passkey: z.string().min(1),
    callbackUrl: z.string().url()
  }),
  cors: z.object({
    origin: z.union([z.string(), z.array(z.string())]),
    credentials: z.boolean().default(true)
  }),
  email: z.object({
    host: z.string().min(1),
    port: z.coerce.number().positive(),
    secure: z.boolean().default(true),
    user: z.string().email(),
    password: z.string().min(1),
    fromName: z.string().min(1),
    fromAddress: z.string().email()
  }).optional()
});

// Parse and validate environment variables
const parseConfig = (): z.infer<typeof configSchema> => {
  try {
    return configSchema.parse({
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      mongoUri: process.env.MONGODB_URI,
      jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN
      },
      mpesa: {
        consumerKey: process.env.MPESA_CONSUMER_KEY,
        consumerSecret: process.env.MPESA_CONSUMER_SECRET,
        shortcode: process.env.MPESA_SHORTCODE,
        passkey: process.env.MPESA_PASSKEY,
        callbackUrl: process.env.MPESA_CALLBACK_URL
      },
      cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
      },
      email: process.env.SMTP_HOST ? {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
        fromName: process.env.SMTP_FROM_NAME,
        fromAddress: process.env.SMTP_FROM_ADDRESS
      } : undefined
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map(err => err.path.join('.'))
        .join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
};

export const config = parseConfig();
export type Config = z.infer<typeof configSchema>;

// Validate the configuration
configSchema.parse(config);

export interface JWTConfig {
  secret: string;
  expiresIn: string | number; // Can be like '24h' or 86400
}