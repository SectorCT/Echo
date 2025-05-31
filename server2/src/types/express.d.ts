import { JwtPayload } from './index';

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
} 