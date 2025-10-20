import { ApiJsonResponse } from '../utils/responseUtil.js';
import jwt from "jsonwebtoken";
import { promisify } from "util";
import dotenv from "dotenv";

dotenv.config();

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
        next();
    }catch(err){
        console.error("error authenticateToken: " + err);
        throw(err);
    }
}