import { Router } from 'express';
import { getMessages } from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/recent', getMessages);

export default router; 