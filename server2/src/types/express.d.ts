import { JwtPayload } from '.';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
} 