import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import Friend from '../models/Friend';
import Message from '../models/Message';
import { authenticateSocket } from '../middleware/socketAuth';
import { uploadImage } from '../services/uploadService';
import { CustomSocket } from '../types';

interface ChatMessageData {
  friendshipToken: string;
  message: string;
  image?: string;
}

export const setupWebSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  io.use(authenticateSocket);

  io.on('connection', (socket: CustomSocket) => {
    const userId = socket.data.user.userId;

    socket.on('join_room', async (friendshipToken: string) => {
      try {
        const friend = await Friend.findOne({
          where: { friendshipToken, userId }
        });

        if (friend) {
          socket.join(`chat_${friend.roomId}`);
        }
      } catch (error) {
        console.error('Error joining room:', error);
      }
    });

    socket.on('chat_message', async (data: ChatMessageData) => {
      try {
        const friend = await Friend.findOne({
          where: { friendshipToken: data.friendshipToken, userId }
        });

        if (!friend) {
          return;
        }

        let imageUrl: string | undefined;
        if (data.image) {
          imageUrl = await uploadImage(data.image);
        }

        const message = await Message.create({
          roomId: friend.roomId,
          authorId: userId,
          content: data.message,
          imageUrl
        });

        io.to(`chat_${friend.roomId}`).emit('message', {
          isOwn: false,
          content: message.content,
          imageUrl: message.imageUrl
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
}; 