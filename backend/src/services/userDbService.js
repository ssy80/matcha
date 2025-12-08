import { db } from '../db/database.js';
import { User } from '../models/user.js'


export async function getUserById(userId)
{
    try{
        const row = await db.get('SELECT * FROM users WHERE id = ?', [userId]);

        if (row){
            const user = new User(row.id, row.email, row.username, row.first_name, row.last_name, row.gender, row.biography, row.date_of_birth, row.sexual_preference, row.user_password, row.user_status, row.created_at, row.updated_at);
            return user;
        }
        else
            return null;
    }
    catch(err){
        console.error("error getUserById: ", err);
        throw err;
    }
}


export async function getUserByEmail(email)
{
    try{
        const row = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (row){
            const user = new User(row.id, row.email, row.username, row.first_name, row.last_name, row.gender, row.biography, row.date_of_birth, row.sexual_preference, row.user_password, row.user_status, row.created_at, row.updated_at);
            return user;
        }
        else
            return null;
    }
    catch(err){
        console.error("error getUserByEmail: ", err);
        throw err;
    }
}


export async function getUserByUsername(username)
{
    try{
        const row = await db.get('SELECT * FROM users WHERE username = ?', [username]);

        if (row){
            const user = new User(row.id, row.email, row.username, row.first_name, row.last_name, row.gender, row.biography, row.date_of_birth, row.sexual_preference, row.user_password, row.user_status, row.created_at, row.updated_at);
            return user;
        }
        else
            return null;
    }
    catch(err){
        console.error("error getUserByUsername: ", err);
        throw err;
    }
}


async function updateUserActivationStatus(user, userActivation)
{
  try{
        await db.run("BEGIN TRANSACTION");
        await db.run('UPDATE users SET user_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;', [user.userStatus, user.id]);
        await db.run('UPDATE user_activations SET activation_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;', [userActivation.activationStatus, userActivation.id]);
        await db.run("COMMIT");
    }
    catch(err){
        await db.run("ROLLBACK");
        console.error("error updateUserActivationStatus: ", err);
        throw err;
    }
}
