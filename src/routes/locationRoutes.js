import express from 'express';
import { updateUserLocation, getMyLocation } from '../services/locationService.js';


const router = express.Router();


router.post('/update', async (req, res) => {
    await updateUserLocation(req, res);
});


router.get('/get', async (req, res) => {
    await getMyLocation(req, res);
});


export default router;
