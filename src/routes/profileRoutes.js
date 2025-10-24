import express from 'express';
import { ApiJsonResponse } from '../utils/responseUtil.js';
import { patchUserProfile, getProfileMe, getProfileUser, viewedProfile, likedProfile, getFameRating } from '../services/profileService.js';

//import dotenv from 'dotenv';
//import crypto from "crypto";
//dotenv.config();

const router = express.Router();


router.patch('/update', async (req, res) => {
    await patchUserProfile(req, res);
});

router.get('/me', async (req, res) => {
    await getProfileMe(req, res);
});

router.get('/:id', async (req, res) => {
    await getProfileUser(req, res);
});

//viewed user profile {viewed_user_id = 1}
router.post('/viewed_profile', async (req, res) => {
    await viewedProfile(req, res);
});

router.post('/liked_profile', async (req, res) => {
    await likedProfile(req, res);
});

router.get('/fame_rating/:id', async (req, res) => {
    await getFameRating(req, res);
});


export default router;