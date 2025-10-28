import express from 'express';
//import { ApiJsonResponse } from '../utils/responseUtil.js';
//import { updateUserLocation } from '../services/locationService.js';
//import { sendChatMessage, getChatMessages } from '../services/chatService.js';
import { getEvents } from '../services/eventService.js';

//import dotenv from 'dotenv';
//import crypto from "crypto";
//dotenv.config();

const router = express.Router();


router.get('/get', async (req, res) => {
    await getEvents(req, res);
});


export default router;