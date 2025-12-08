import { db } from '../db/database.js';
import dotenv from 'dotenv';


dotenv.config();


export async function getEvents(req, res){
    try{
        const userId = req.user.id;
        const events = await getEventsDb(userId, "new");
        for (const evt of events) {
            await updateEventStatus(evt, "delivered");
        }
        res.status(200).json({"success": true, "events": events});
    }catch(err){
        console.error("error getEvents: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


export async function addEvent(event){
    try{
        await db.run("INSERT INTO events(user_id, from_user_id, event_type, event_status) VALUES(?,?,?,?)",
            [event.userId, event.fromUserId, event.eventType, event.eventStatus]);
    }catch(err){
        console.error("error addEvent: ", err);
        throw (err);
    }
}

async function getEventsDb(userId, eventStatus){
    try{
        const rows =await db.all("SELECT e.*, fu.username as from_username FROM events e, users fu WHERE e.user_id = ? AND e.event_status = ? AND fu.id = e.from_user_id;",
            [userId, eventStatus]);
        return rows;
    }catch(err){
        console.error("error getEventsDb: ", err);
        throw (err);
    }
}


async function updateEventStatus(event, status){
    try{
        await db.run("UPDATE events SET event_status = ? WHERE id = ?;",[status, event.id]);
    }catch(err){
        console.error("error updateEventStatus: ", err);
        throw (err);
    }
}
