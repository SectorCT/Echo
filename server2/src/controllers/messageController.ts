import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import Message from '../models/Message';
import Room from '../models/Room';
import User from '../models/User';
import { Op } from 'sequelize';

export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { roomId } = req.params;

    const room = await Room.findOne({
      where: { id: roomId },
      include: [
        {
          model: User,
          through: { attributes: [] }
        }
      ]
    });

    if (!room) {
      return res.status(404).json({
        status: 'error',
        message: 'Room not found'
      });
    }

    const isUserInRoom = room.users.some(user => user.id === userId);
    if (!isUserInRoom) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not a member of this room'
      });
    }

    const messages = await Message.findAll({
      where: { roomId },
      include: [
        {
          model: User,
          attributes: ['usernameToken']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    const formattedMessages = messages.map(message => ({
      id: message.id,
      content: message.content,
      imageUrl: message.imageUrl,
      isOwn: message.author.usernameToken === req.user!.usernameToken,
      createdAt: message.createdAt
    }));

    return res.status(200).json({
      status: 'success',
      data: formattedMessages
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Could not fetch messages'
    });
  }
};

export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { roomId } = req.params;
    const { content, imageUrl } = req.body;

    const room = await Room.findOne({
      where: { id: roomId },
      include: [
        {
          model: User,
          through: { attributes: [] }
        }
      ]
    });

    if (!room) {
      return res.status(404).json({
        status: 'error',
        message: 'Room not found'
      });
    }

    const isUserInRoom = room.users.some(user => user.id === userId);
    if (!isUserInRoom) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not a member of this room'
      });
    }

    const message = await Message.create({
      content,
      imageUrl,
      authorId: userId,
      roomId
    });

    const populatedMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          attributes: ['usernameToken']
        }
      ]
    });

    return res.status(201).json({
      status: 'success',
      data: {
        id: populatedMessage!.id,
        content: populatedMessage!.content,
        imageUrl: populatedMessage!.imageUrl,
        isOwn: true,
        createdAt: populatedMessage!.createdAt
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Could not send message'
    });
  }
}; 