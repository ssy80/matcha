import express from 'express';
//import { ApiJsonResponse } from '../utils/responseUtil.js';
import { patchUserProfile, getProfileMe, getProfileUser, likedProfile, getFameRating, getOnlineStatus } from '../services/profileService.js';
import { isUserViewedMe, isUserLikedMe, blockedProfile, getViewedMeList, getLikedMeList, fakedProfile } from '../services/profileService.js';

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

//get list of who viewed me
router.get('/viewed_me_list', async (req, res) => {
    //console.log("/viewed_me_list");
    await getViewedMeList(req, res);
});

//get list of who liked me
router.get('/liked_me_list', async (req, res) => {
    //console.log("/liked_me_list");
    await getLikedMeList(req, res);
});

router.get('/:id', async (req, res) => {
    await getProfileUser(req, res);
});

//viewed user profile {viewed_user_id = 1}
/*router.post('/viewed_profile', async (req, res) => {
    await viewedProfile(req, res);
});*/

router.post('/liked_profile', async (req, res) => {
    await likedProfile(req, res);
});

router.get('/fame_rating/:id', async (req, res) => {
    await getFameRating(req, res);
});

//get user online status
router.get('/online/:id', async (req, res) => {
    await getOnlineStatus(req, res);
});

//check userid got view me?
router.get('/viewed_me/:id', async (req, res) => {
    await isUserViewedMe(req, res);
});

router.get('/liked_me/:id', async (req, res) => {
    await isUserLikedMe(req, res);
});

//blocking user
router.post('/blocked_user', async (req, res) => {
    await blockedProfile(req, res);
});

router.post('/faked_user', async (req, res) => {
    await fakedProfile(req, res);
});

export default router;