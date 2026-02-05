import { db } from '../db/database.js';
import dotenv from 'dotenv';
import { Validation } from '../utils/validationUtils.js';
import { getLikedHistoryDb, getUserBlocked } from './profileService.js';
import { ChatMessage } from '../models/chat_message.js';
import { Event } from '../models/event.js';
import { addEvent } from './eventService.js';


dotenv.config();


export const getChatMessages = async (req, res) => {
    try{
        const userId = req.user.id;
        const messages = await getChatMessagesDb(userId);
        for (const msg of messages) {
            await updateMessageStatus(msg, "delivered");
        }
        res.status(200).json({"success": true, "messages": messages});
    }catch(err){
        console.error("error getChatMessages: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


export async function sendChatMessage(req, res){
    try{
        const userId = req.user.id;
        const chatData = req.body;
        let toUserId = chatData?.to_user_id ?? null;
        let message = chatData?.message ?? null;
        if (toUserId == null || typeof toUserId !== "number" || !Number.isInteger(toUserId)){
            res.status(400).json({"success": false, "error": "invalid to_user_id"});
            return;
        }
        if (message == null || typeof message !== "string" || !Validation.isLengthBetween(message.trim(), 0, 500)){
            res.status(400).json({"success": false, "error": "invalid message"});
            return;
        }
        message = message.trim();

        const iLiked = await getLikedHistoryDb(userId, toUserId);
        const likedMe = await getLikedHistoryDb(toUserId, userId);
        if (iLiked == null || likedMe == null){
            res.status(409).json({"success": false, "error": "not connected"});
            return;
        }
        const iBlocked = await getUserBlocked(userId, toUserId);
        const blockedMe = await getUserBlocked(toUserId, userId);
        if (iBlocked || blockedMe){
            res.status(409).json({"success": false, "error": "blocked"});
            return;
        }
        const chatMessage = new ChatMessage(null, userId, toUserId, message, "new", null, null);
        await addChatMessage(chatMessage);
        res.status(201).json({"success": true});
    }catch(err){
        console.error("error sendChatMessages: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


async function addChatMessage(chatMessage){
    try{
        
        await db.run("INSERT INTO chat_messages(from_user_id, to_user_id, message, message_status) VALUES(?,?,?,?)",
            [chatMessage.fromUserId, chatMessage.toUserId, chatMessage.message, chatMessage.messageStatus]);
        
        //check got same event    
        const eventChat = await db.get("SELECT * FROM events WHERE user_id = ? AND from_user_id = ? AND \
            event_type = 'new_message' AND event_status = 'new';",
                [chatMessage.toUserId, chatMessage.fromUserId]);
        if (eventChat){
            await db.run("UPDATE events SET updated_at = CURRENT_TIMESTAMP WHERE id = ?;", [eventChat.id]);
        }
        else{
            const event = new Event(null, chatMessage.toUserId, chatMessage.fromUserId, "new_message", "new", null, null);
            await addEvent(event);
        }
    }catch(err){
            console.error("error addChatMessage: ", err);
            throw (err);
    }
}


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

export const getConversation = async (req, res) => {
    try {
        const userId = req.user.id;
        let otherUserId = req.params.userId;

        if (!otherUserId) {
            return res.status(400).json({ success: false, error: "Missing user ID" });
        }

        await db.run(`
            UPDATE chat_messages 
            SET message_status = 'read' 
            WHERE from_user_id = ? AND to_user_id = ?
        `, [otherUserId, userId]);

        const query = `
            SELECT * FROM chat_messages 
            WHERE (from_user_id = ? AND to_user_id = ?) 
               OR (from_user_id = ? AND to_user_id = ?)
            ORDER BY created_at ASC
        `;   
        
        const messages = await db.all(query, [userId, otherUserId, otherUserId, userId]);
        res.status(200).json({ success: true, messages });
    } catch (err) {
        console.error("error getConversation: ", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
};