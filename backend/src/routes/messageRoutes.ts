import { Router } from 'express';
import { sendMessage, getConversations, getMessages, markAsRead } from '../controllers/messageController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/history/:otherUserId', getMessages);
router.post('/read', markAsRead);

export default router;
