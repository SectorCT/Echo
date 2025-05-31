import { Socket as BaseSocket } from 'socket.io';

export interface JwtPayload {
  userId: string;
  usernameToken: string;
  iat?: number;
  exp?: number;
}

export interface SocketData {
  user: JwtPayload;
}

export interface CustomSocket extends BaseSocket {
  data: SocketData;
} 