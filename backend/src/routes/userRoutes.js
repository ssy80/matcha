import express from 'express';
import { registerUser, activateUser, userLogin, resetPasswordRequest, resetUserPassword, userLogout } from '../services/userServices.js';
import { authenticateToken } from '../middlewares/authentication.js';

const router = express.Router();


router.post('/register', async (req, res) => {
    await registerUser(req, res);
});


router.post('/activate', async (req, res) => {
    await activateUser(req, res);
});


router.post('/login', async (req, res) => {
    await userLogin(req, res);
});

router.post('/logout', authenticateToken,async (req, res) => {
    await userLogout(req, res);
});


router.post('/reset_password_request', async (req, res) => {
    await resetPasswordRequest(req, res);
});


router.post('/reset_user_password', async (req, res) => {
    await resetUserPassword(req, res);
});


export default router;
