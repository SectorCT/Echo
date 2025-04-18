import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Friend from '../models/Friend';
import User from '../models/User';
import Room from '../models/Room';
import Message from '../models/Message';
import { Op } from 'sequelize';
import { AuthenticatedRequest } from '../middleware/auth';

export const getFriends = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const friends = await Friend.findAll({
      where: {
        [Op.or]: [
          { userId },
          { friendId: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['usernameToken', 'friendToken']
        },
        {
          model: User,
          as: 'friend',
          attributes: ['usernameToken', 'friendToken']
        },
        {
          model: Room,
          include: [
            {
              model: Message,
              limit: 1,
              order: [['createdAt', 'DESC']],
              include: [
                {
                  model: User,
                  attributes: ['usernameToken']
                }
              ]
            }
          ]
        }
      ]
    });

    const formattedFriends = friends.map(friend => {
      const otherUser = friend.userId === userId ? friend.friend : friend.user;
      return {
        id: friend.id,
        usernameToken: otherUser.usernameToken,
        friendToken: otherUser.friendToken,
        roomId: friend.roomId,
        isLatestMessageFromMe: friend.room?.messages?.[0]?.author?.usernameToken === req.user!.usernameToken,
        lastMessage: friend.room?.messages?.[0]?.content,
        lastMessageTime: friend.room?.messages?.[0]?.createdAt
      };
    });

    return res.status(200).json({
      status: 'success',
      data: formattedFriends
    });
  } catch (error) {
    console.error('Error getting friends:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Could not fetch friends'
    });
  }
};

export const addFriend = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { friendToken } = req.body;

    const friendUser = await User.findOne({ where: { friendToken } });
    if (!friendUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (friendUser.id === userId) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot add yourself as a friend'
      });
    }

    const existingFriendship = await Friend.findOne({
      where: {
        [Op.or]: [
          { userId, friendId: friendUser.id },
          { userId: friendUser.id, friendId: userId }
        ]
      }
    });

    if (existingFriendship) {
      return res.status(400).json({
        status: 'error',
        message: 'Friendship already exists'
      });
    }

    const room = await Room.create({ name: `room_${userId}_${friendUser.id}` });

    const friendship = await Friend.create({
      userId,
      friendId: friendUser.id,
      roomId: room.id
    });

    return res.status(201).json({
      status: 'success',
      data: {
        id: friendship.id,
        usernameToken: friendUser.usernameToken,
        friendToken: friendUser.friendToken,
        roomId: room.id
      }
    });
  } catch (error) {
    console.error('Error adding friend:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Could not add friend'
    });
  }
};

export const removeFriend = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { friendId } = req.params;

    const friendship = await Friend.findOne({
      where: {
        [Op.or]: [
          { userId, friendId },
          { userId: friendId, friendId: userId }
        ]
      }
    });

    if (!friendship) {
      return res.status(404).json({
        status: 'error',
        message: 'Friendship not found'
      });
    }

    await friendship.destroy();
    return res.status(200).json({
      status: 'success',
      message: 'Friend removed successfully'
    });
  } catch (error) {
    console.error('Error removing friend:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Could not remove friend'
    });
  }
};

export const changeNickname = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { friendshipToken, newNickname } = req.body;
    const userId = req.user!.userId;

    const friend = await Friend.findOne({
      where: { friendshipToken, userId }
    });

    if (!friend) {
      return res.status(404).json({
        status: 'error',
        message: 'Friend not found.'
      });
    }

    friend.nickname = newNickname;
    await friend.save();

    return res.status(200).json({
      status: 'success',
      message: 'Nickname updated successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Could not update nickname.'
    });
  }
}; 