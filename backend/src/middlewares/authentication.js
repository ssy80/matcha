import jwt from "jsonwebtoken";
import { promisify } from "util";
import dotenv from "dotenv";
import { db } from '../db/database.js';


dotenv.config();


const jwtVerifyAsync = promisify(jwt.verify); //wrap the callback nature of jwt.verify to be a async func


export const authenticateToken = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        res.status(401).json({"success": false, "error": "invalid authorization format"});
        return;
    }

    const jwtToken = authorization.split(' ')[1];
    if (!jwtToken){
        res.status(401).json({"success": false, "error": "no token provided"});
        return;
    }

    try{
        const decodedData = await jwtVerifyAsync(jwtToken, process.env.JWT_SECRET);
        req.user = decodedData;

        //update user_onlines
        await updateUserOnline(req.user.id);

        next();
    }catch(err){
        console.error("error authenticateToken:", err);
        if (err.name === "TokenExpiredError") {
            res.status(403).json({"success": false, "error": "token expired"});
        } else if (err.name === "JsonWebTokenError") {
            res.status(403).json({"success": false, "error": "invalid token"});
        } else {
            res.status(500).json({"success": false, "error": "internal server error"});
        }
        return;
    }
}


async function updateUserOnline(userId) {
    try {
        const row = await db.get('SELECT 1 FROM user_onlines WHERE user_id = ?', [userId]);
        
        if (row) {
            await db.run('UPDATE user_onlines SET is_online = 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?', [userId]);
        } else {
            await db.run('INSERT INTO user_onlines (user_id, is_online, created_at, updated_at) VALUES (?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)', [userId]);
        }
    } catch (err) {
        console.error("error updateUserOnline: ", err);
    }
}
