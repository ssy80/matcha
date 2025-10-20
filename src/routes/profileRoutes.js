import express from 'express';
import { ApiJsonResponse } from '../utils/responseUtil.js';
import { addUserProfile } from '../services/profileService.js';

//import dotenv from 'dotenv';
//import crypto from "crypto";
//dotenv.config();

const router = express.Router();


router.put('/profile_update', async (req, res) => {
    addUserProfile(req, res);
    //res.status(200).json(ApiJsonResponse(["success"], null));
});

/*router.get('/me', async (req, res) => {
    console.log("user profile", req.user);
    res.status(200).json(ApiJsonResponse(["success"], null));
});*/


export default router;