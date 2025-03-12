import { Request, Response } from 'express';
import Friend from '../models/Friend';
import Message from '../models/Message';
import Room from '../models/Room';
import User from '../models/User';

export const getRecentMessages = async (req: Request, res: Response) => {
  try {
    const { friendshipToken } = req.body;
    const userId = req.user!.userId;

    const friend = await Friend.findOne({
      where: { friendshipToken, userId },
      include: [{ model: Room, as: 'room' }]
    });

    if (!friend) {
      return res.status(404).json({
        status: 'error',
        message: 'Friend not found.'
      });
    }

    const messages = await Message.findAll({
      where: { roomId: friend.roomId },
      order: [['createdAt', 'DESC']],
      limit: 10,
      include: [{ model: User, as: 'author', attributes: ['usernameToken'] }]
    });

    const messageList = messages.reverse().map(message => ({
      isOwn: message.author.usernameToken === req.user!.usernameToken,
      content: message.content,
      imageUrl: message.imageUrl || null
    }));

    return res.status(200).json({ messages: messageList });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Could not fetch messages.'
    });
  }
}; 