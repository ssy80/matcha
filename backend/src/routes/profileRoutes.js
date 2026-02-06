import express from 'express';
import { patchUserProfile, getProfileMe, getProfileUser, likedProfile, getFameRating, getOnlineStatus, exportUserData } from '../services/profileService.js';
import { isUserViewedMe, isUserLikedMe, blockedProfile, getViewedMeList, getLikedMeList, fakedProfile, getMatches } from '../services/profileService.js';
import { authenticateToken } from '../middlewares/authentication.js';

const router = express.Router();


router.patch('/update', async (req, res) => {
    await patchUserProfile(req, res);
});


router.get('/me', authenticateToken, async (req, res) => {
    await getProfileMe(req, res);
});


router.get('/export', authenticateToken, async (req, res) => {
    await exportUserData(req, res);
});


router.get('/liked_me', async (req, res) => {
    await getLikedMeList(req, res);
});


router.get('/viewed_me', async (req, res) => {
    await getViewedMeList(req, res);
});


router.get('/viewed_me_list', async (req, res) => {
    await getViewedMeList(req, res);
});


router.get('/liked_me_list', async (req, res) => {
    await getLikedMeList(req, res);
});


router.get('/matches', async (req, res) => {
    await getMatches(req, res);
});


router.get('/:id', async (req, res) => {
    await getProfileUser(req, res);
});


router.post('/liked_profile', async (req, res) => {
    await likedProfile(req, res);
});

//--start
router.get('/fame_rating/:id', async (req, res) => {
    await getFameRating(req, res);
});


router.get('/online/:id', async (req, res) => {
    await getOnlineStatus(req, res);
});


router.get('/viewed_me/:id', async (req, res) => {
    await isUserViewedMe(req, res);
});


router.get('/liked_me/:id', async (req, res) => {
    await isUserLikedMe(req, res);
});


router.post('/blocked_user', async (req, res) => {
    await blockedProfile(req, res);
});


router.post('/faked_user', async (req, res) => {
    await fakedProfile(req, res);
});

router.get('/matches', async (req, res) => {
    await getMatches(req, res);
});

export default router;
