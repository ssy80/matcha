import { db } from "../db/database.js";
import dotenv from "dotenv";


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


export async function addEvent(req, event) {
    try {
        const io = req.app.get("io");

        const result = await db.run(`INSERT INTO events(user_id, from_user_id, event_type, event_status) VALUES(?,?,?,?)`,
            [event.userId, event.fromUserId, event.eventType, "new"]
        );
        const insertedId = result.lastID;
        const fullEvent = await getEventById(insertedId);

        io.to(`user_${event.userId}`).emit("event_created", fullEvent);

        await updateEventStatus(fullEvent, "delivered");

    } catch (err) {
        console.error("error addEvent:", err);
        throw (err);
    }
}


export async function getEventsDb(userId, eventStatus){
    try{
        const rows =await db.all("SELECT e.*, fu.username as from_username FROM events e, users fu WHERE e.user_id = ? AND e.event_status = ? AND fu.id = e.from_user_id;",
            [userId, eventStatus]);
        return rows;
    }catch(err){
        console.error("error getEventsDb: ", err);
        throw (err);
    }
}


export async function updateEventStatus(event, status){
    try{
        await db.run("UPDATE events SET event_status = ? WHERE id = ?;",[status, event.id]);
    }catch(err){
        console.error("error updateEventStatus: ", err);
        throw (err);
    }
}


export async function getEventById(eventId){
    try{
        const rows =await db.get("SELECT e.*, fu.username as from_username FROM events e, users fu WHERE e.id = ? AND fu.id = e.from_user_id",
            [eventId]);
        return rows;
    }catch(err){
        console.error("error getEventById: ", err);
        throw (err);
    }
}
