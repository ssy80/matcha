import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { User } from '../models/user.js'

const db = await open({
  filename: '././database/matcha.db',
  driver: sqlite3.Database
});

export async function getUserById(userId)
{
    try{
        const row = await db.get('SELECT * FROM users WHERE id = ?', [userId])

        if (row){
            const user = new User(row.id, row.email, row.username, row.first_name, row.last_name, row.gender, row.biography, row.date_of_birth, row.user_password, row.user_status, row.created_at, row.updated_at);
            return user;
        }
        else
            return null;
    }
    catch(err){
        console.error("error db:", err);
        throw err;
    }
}


export async function getUserByEmail(email)
{
    try{
        const row = await db.get('SELECT * FROM users WHERE email = ?', [email])

        if (row){
            const user = new User(row.id, row.email, row.username, row.first_name, row.last_name, row.gender, row.biography, row.date_of_birth, row.user_password, row.user_status, row.created_at, row.updated_at);
            return user;
        }
        else
            return null;
    }
    catch(err){
        console.error("error db:", err);
        throw err;
    }
}


export async function getUserByUsername(username)
{
    try{
        const row = await db.get('SELECT * FROM users WHERE username = ?', [username])

        if (row){
            const user = new User(row.id, row.email, row.username, row.first_name, row.last_name, row.gender, row.biography, row.date_of_birth, row.user_password, row.user_status, row.created_at, row.updated_at);
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
        console.error("error db:", err);
        throw err;
    }
}

