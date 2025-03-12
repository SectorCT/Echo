import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

let socket: Socket | null = null;

export const initializeSocket = async () => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  if (!accessToken) return null;

  socket = io(API_CONFIG.wsURL, {
    auth: {
      token: accessToken
    },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  if (__DEV__) {
    socket.on('connect', () => {
      console.log('WebSocket Connected');
      console.log('Socket ID:', socket?.id);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket Connection Error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket Disconnected:', reason);
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

export const joinRoom = (friendshipToken: string) => {
  if (socket) {
    socket.emit('join_room', friendshipToken);
  }
};

export const sendMessage = (friendshipToken: string, message: string, image?: string) => {
  if (socket) {
    socket.emit('chat_message', { friendshipToken, message, image });
  }
}; 