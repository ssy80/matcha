import express from 'express';
import { getSuggestedProfiles, searchProfiles } from '../services/searchService.js';


const router = express.Router();


router.get('/suggested_profiles', async (req, res) => {
    await getSuggestedProfiles(req, res);
});


router.post('/search_profiles', async (req, res) => {
    await searchProfiles(req, res);
});


export default router;
