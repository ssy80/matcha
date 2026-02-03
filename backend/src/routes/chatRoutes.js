import express from 'express';
import { sendChatMessage, getChatMessages } from '../services/chatService.js';
import { getConversation } from '../services/chatService.js';

const router = express.Router();


router.post('/send', async (req, res) => {
    await sendChatMessage(req, res);
});

router.get('/get', async (req, res) => {
    await getChatMessages(req, res);
});

router.get('/history/:userId', async (req, res) => {
    await getConversation(req, res);
});

export default router;
