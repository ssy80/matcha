import { ApiJsonResponse } from '../utils/responseUtil.js';
import jwt from "jsonwebtoken";
import { promisify } from "util";
import dotenv from "dotenv";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

dotenv.config();

const db = await open({
  filename: '././database/matcha.db',
  driver: sqlite3.Database
});

const jwtVerifyAsync = promisify(jwt.verify); //wrap the callback nature of jwt.verify to be a async func


export const authenticateToken = async (req, res, next) => {
    const header = req.headers;
    const authorization = header && header.authorization;
    const jwtToken = authorization && authorization.split(" ")[1]

    if (!jwtToken){
        res.status(401).json(ApiJsonResponse(null, ["no token provided"]));
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
            res.status(403).json(ApiJsonResponse(null, ["token expired"]));
        } else if (err.name === "JsonWebTokenError") {
            res.status(403).json(ApiJsonResponse(null, ["invalid token"]));
        } else {
            res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
        }
        return;
    }
}


async function updateUserOnline(userId){
    try{
        await db.run('UPDATE user_onlines set updated_at = CURRENT_TIMESTAMP WHERE user_id = ?;',[userId]);
    }
    catch(err){
        console.error("error updateUserOnline: ", err);
        throw err;
    }
}