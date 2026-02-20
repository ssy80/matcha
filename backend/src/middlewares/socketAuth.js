import jwt from "jsonwebtoken";
import { promisify } from "util";
import dotenv from "dotenv";


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const jwtVerifyAsync = promisify(jwt.verify);

export const socketAuthenticate = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Authentication error: Token missing"));
        }

        const decoded = await jwtVerifyAsync(token, JWT_SECRET);

        socket.user = decoded;

        next();
    } catch (err) {
        next(new Error("Authentication error: Invalid token"));
    }
};
