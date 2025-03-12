import { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key-here',
  accessTokenOptions: {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '1h'
  } as SignOptions,
  refreshTokenOptions: {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
  } as SignOptions
}; 