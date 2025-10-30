import express from 'express';
import { getEvents } from '../services/eventService.js';


const router = express.Router();


router.get('/get', async (req, res) => {
    await getEvents(req, res);
});


export default router;
