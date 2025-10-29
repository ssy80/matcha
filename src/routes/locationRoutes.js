
import express from 'express';
import { ApiJsonResponse } from '../utils/responseUtil.js';
import { updateUserLocation, getMyLocation } from '../services/locationService.js';

//import dotenv from 'dotenv';
//import crypto from "crypto";
//dotenv.config();

const router = express.Router();

router.post('/update', async (req, res) => {
    await updateUserLocation(req, res);
});


router.get('/get', async (req, res) => {
    await getMyLocation(req, res);
});



export default router;