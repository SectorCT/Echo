import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { ExtendedError } from 'socket.io/dist/namespace';
import { CustomSocket, JwtPayload } from '../types';

export const authenticateSocket = (
  socket: CustomSocket,
  next: (err?: ExtendedError) => void
) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload;
    socket.data = { user: decoded };
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
}; 