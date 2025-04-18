import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { JwtPayload } from '../types';
import redisClient from '../config/redis';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklisted_${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ status: 'error', message: 'Token is blacklisted' });
    }

    const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ status: 'error', message: 'Invalid token' });
  }
}; 