import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getFriends,
  addFriend,
  removeFriend,
  changeNickname
} from '../controllers/friendController';

const router = Router();

router.get('/', authenticateToken, getFriends);
router.post('/', authenticateToken, addFriend);
router.delete('/:friendId', authenticateToken, removeFriend);
router.patch('/nickname', authenticateToken, changeNickname);

export default router; 