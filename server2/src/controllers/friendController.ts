import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Friend from '../models/Friend';
import User from '../models/User';
import Room from '../models/Room';
import Message from '../models/Message';
import { Op } from 'sequelize';

export const makeFriends = async (req: Request, res: Response) => {
  try {
    const { friendToken } = req.body;
    const userId = req.user!.userId;

    if (!friendToken) {
      return res.status(400).json({
        status: 'error',
        message: 'No friend token provided.'
      });
    }

    const friend = await User.findOne({ where: { friendToken } });
    const user = await User.findByPk(userId);

    if (!friend || !user) {
      return res.status(404).json({
        status: 'error',
        message: 'User or friend not found.'
      });
    }

    // Create room name from sorted usernames
    const nameArray = [user.usernameToken, friend.usernameToken].sort();
    const roomName = nameArray.join('');

    // Create room and add users
    const room = await Room.create({ name: roomName });
    await room.$add('users', [user.id, friend.id]);

    // Create friendship records for both users
    const userFriend = await Friend.create({
      userId: user.id,
      friendId: friend.id,
      nickname: uuidv4().slice(0, 8),
      friendshipToken: uuidv4().toUpperCase().slice(0, 8),
      roomId: room.id
    });

    await Friend.create({
      userId: friend.id,
      friendId: user.id,
      nickname: uuidv4().slice(0, 8),
      friendshipToken: uuidv4().toUpperCase().slice(0, 8),
      roomId: room.id
    });

    // Update friend tokens
    user.friendToken = uuidv4().toUpperCase().slice(0, 8);
    friend.friendToken = uuidv4().toUpperCase().slice(0, 8);
    await Promise.all([user.save(), friend.save()]);

    return res.status(200).json({
      status: 'success',
      message: 'Friend added successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Could not add friend.'
    });
  }
};

export const listFriends = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const friends = await Friend.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'friend',
          attributes: ['usernameToken']
        },
        {
          model: Room,
          as: 'room',
          include: [
            {
              model: Message,
              limit: 1,
              order: [['createdAt', 'DESC']],
              include: [{ model: User, as: 'author', attributes: ['usernameToken'] }]
            }
          ]
        }
      ]
    });

    const friendList = friends.map(friend => ({
      nickname: friend.nickname,
      friendshipToken: friend.friendshipToken,
      isLatestMessageFromMe: friend.room?.messages?.[0]?.author?.usernameToken === req.user!.usernameToken,
      latestMessage: friend.room?.messages?.[0]?.content || null
    }));

    return res.status(200).json({ friends: friendList });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Could not fetch friends.'
    });
  }
};

export const changeNickname = async (req: Request, res: Response) => {
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

export const removeFriend = async (req: Request, res: Response) => {
  try {
    const { friendshipToken } = req.body;
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

    // Delete both friendship records and the room
    await Friend.destroy({
      where: {
        [Op.or]: [
          { userId: friend.userId, friendId: friend.friendId },
          { userId: friend.friendId, friendId: friend.userId }
        ]
      }
    });

    await Room.destroy({
      where: { id: friend.roomId }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Friend removed successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Could not remove friend.'
    });
  }
}; 