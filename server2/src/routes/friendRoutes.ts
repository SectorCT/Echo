import { Router } from 'express';
import {
  makeFriends,
  listFriends,
  changeNickname,
  removeFriend
} from '../controllers/friendController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/make-friends', makeFriends);
router.get('/list', listFriends);
router.put('/change-nickname', changeNickname);
router.delete('/remove', removeFriend);

export default router; 