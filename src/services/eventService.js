import { ApiJsonResponse } from '../utils/responseUtil.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import axios from 'axios';
import { UserLocation } from '../models/user_location.js';
import { Validation } from '../utils/validationUtils.js';
import { getLikedHistoryDb, getUserBlocked } from './profileService.js';
import { ChatMessage } from '../models/chat_message.js';

dotenv.config();

//const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

const db = await open({
  filename: '././database/matcha.db',
  driver: sqlite3.Database
});


//getEvents(req, res);
export async function getEvents(req, res){
    try{
        const userId = req.user.id;
        const events = await getEventsDb(userId, "new");

        res.status(400).json(ApiJsonResponse([events], null));
    }catch(err){
        console.error("error getEvents: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}


export async function addEvent(event){
    try{
        console.log(event);

        await db.run("INSERT INTO events(user_id, from_user_id, event_type, event_status) VALUES(?,?,?,?)",
            [event.userId, event.fromUserId, event.eventType, event.eventStatus]);
        
    }catch(err){
            console.error("error addEvent: ", err);
            throw (err);
    }
}

async function getEventsDb(userId, eventStatus){
    try{

        const rows =await db.all("SELECT * FROM events WHERE user_id = ? AND event_status = ?;",
            [userId, eventStatus]);
        return rows;
    }catch(err){
            console.error("error getEventsDb: ", err);
            throw (err);
    }
}