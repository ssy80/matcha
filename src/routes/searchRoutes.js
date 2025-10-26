
import express from 'express';
import { ApiJsonResponse } from '../utils/responseUtil.js';
import { getSuggestedProfiles } from '../services/searchService.js';

//import dotenv from 'dotenv';
//import crypto from "crypto";
//dotenv.config();

const router = express.Router();

router.get('/suggested_profiles', async (req, res) => {
    await getSuggestedProfiles(req, res);
});


export default router;