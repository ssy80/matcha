import express from 'express';
//import { ApiJsonResponse } from '../utils/responseUtil.js';
//import { updateUserLocation } from '../services/locationService.js';
import { sendChatMessage, getChatMessages } from '../services/chatService.js';

//import dotenv from 'dotenv';
//import crypto from "crypto";
//dotenv.config();

const router = express.Router();

router.post('/send', async (req, res) => {
    await sendChatMessage(req, res);
});

router.get('/get', async (req, res) => {
    await getChatMessages(req, res);
});


export default router;