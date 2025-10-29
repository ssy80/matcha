import { ApiJsonResponse } from '../utils/responseUtil.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import axios from 'axios';
import { UserLocation } from '../models/user_location.js';
import { Validation } from '../utils/validationUtils.js';
import { getLikedHistoryDb, getUserBlocked } from './profileService.js';
import { ChatMessage } from '../models/chat_message.js';
import { Event } from '../models/event.js';
import { addEvent } from './eventService.js';

dotenv.config();

//const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

const db = await open({
  filename: '././database/matcha.db',
  driver: sqlite3.Database
});


//getChatMessages
export const getChatMessages = async (req, res) => {
    try{
        const userId = req.user.id;
        const messages = await getChatMessagesDb(userId);
        console.log(messages);
        console.log(messages.length);
        for (const msg of messages) {
            await updateMessageStatus(msg, "delivered");
        }
        res.status(400).json(ApiJsonResponse([messages], null));
    }catch(err){
        console.error("error sendChatMessages: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}


export async function sendChatMessage(req, res){
    try{
        const userId = req.user.id;
        const chatData = req.body;
        let toUserId = chatData?.to_user_id ?? null;
        let message = chatData?.message ?? null;
        if (toUserId === null || typeof toUserId !== "number" || !Number.isInteger(toUserId)){
            res.status(400).json(ApiJsonResponse(null, ["invalid to_user_id"]));
            return;
        }
        if (message === null || typeof message !== "string" || !Validation.isLengthBetween(message.trim(), 0, 500)){
            res.status(400).json(ApiJsonResponse(null, ["invalid message"]));
            return;
        }
        message = message.trim();
        console.log(toUserId);
        console.log(message);
        //check valid toUserId
        //whether connected ?
        //whether blocked ?
        const iLiked = await getLikedHistoryDb(userId, toUserId);
        const likedMe = await getLikedHistoryDb(toUserId, userId);
        console.log(iLiked);
        console.log(likedMe);
        if (iLiked === null || likedMe === null){
            res.status(400).json(ApiJsonResponse(null, ["not connected"]));
            return;
        }
        const iBlocked = await getUserBlocked(userId, toUserId);
        const blockedMe = await getUserBlocked(toUserId, userId);
        console.log(iBlocked)
        console.log(blockedMe)
        if (iBlocked || blockedMe){
            res.status(400).json(ApiJsonResponse(null, ["blocked"]));
            return;
        }
        const chatMessage = new ChatMessage(null, userId, toUserId, message, "new", null, null);
        console.log(chatMessage)
        await addChatMessage(chatMessage);
        res.status(400).json(ApiJsonResponse(["success"], null));
    }catch(err){
        console.error("error sendChatMessages: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}


//addChatMessage(chatMessage);
async function addChatMessage(chatMessage){
    try{
        
        await db.run("INSERT INTO chat_messages(from_user_id, to_user_id, message, message_status) VALUES(?,?,?,?)",
            [chatMessage.fromUserId, chatMessage.toUserId, chatMessage.message, chatMessage.messageStatus]);
        console.log(chatMessage)
        const event = new Event(null, chatMessage.toUserId, chatMessage.fromUserId, "new_message", "new", null, null);
        console.log(event)
        await addEvent(event);
    }catch(err){
            console.error("error addChatMessage: ", err);
            throw (err);
    }
}

/*async function checkIsConnected(userId, toUserId){
    try{
            const row = await db.get('SELECT * from user_onlines WHERE user_id = ?;', [userId]);
            if(row){
                const userOnline = new UserOnline(row.user_id, row.created_at, row.updated_at);
                return userOnline;
            }
            return null;
        }catch(err){
            console.error("error getUserOnlineDb: ", err);
            throw (err);
    }
}*/


async function getChatMessagesDb(userId){
    try{
        
        const rows = db.all("SELECT c.*, fu.username as from_username FROM chat_messages c, users fu WHERE to_user_id = ? AND message_status = 'new' AND c.from_user_id = fu.id;",[userId]);
        return rows;
        
    }catch(err){
            console.error("error getChatMessagesDb: ", err);
            throw (err);
    }
}


async function updateMessageStatus(msg, status){
    try{
        
        await db.run("UPDATE chat_messages SET message_status = ? WHERE id = ?;",[status, msg.id]);
        
    }catch(err){
            console.error("error updateMessageStatus: ", err);
            throw (err);
    }
}