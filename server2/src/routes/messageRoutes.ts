import { Router } from 'express';
import { getRecentMessages } from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/recent', getRecentMessages);

export default router; 