import { ApiJsonResponse } from '../utils/responseUtil.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { User } from '../models/user.js'
import { Validation } from '../utils/validationUtils.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import crypto from "crypto";
import { UserActivation } from '../models/user_activation.js';
import { sendActivationEmail } from '../services/emailService.js';

dotenv.config();

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)

const db = await open({
  filename: '././database/matcha.db',
  driver: sqlite3.Database
});


export const registerUser = async (req, res) => {
    try{
        const userData = req.body;
        const email = userData.email.trim()
        const username = userData.username.trim()
        const firstName = userData.first_name.trim()
        const lastName = userData.last_name.trim()
        const userPassword = userData.user_password.trim()
        
        const user = new User(null, email, username, firstName, lastName, userPassword, "new", null, null)
        
        if (validateUserFields(user))
        {
            const hashedPassword = await bcrypt.hash(userPassword, saltRounds);
            user.userPassword = hashedPassword
        
            if (!await validateUsername(user))
            {
                res.status(409).json(ApiJsonResponse(null, ["username in use"]));
                return;  
            }
            if (!await validateUserEmail(user))
            {
                res.status(409).json(ApiJsonResponse(null, ["email in use"]));
                return;
            }
        
            //insert user
            const userId = await addUser(user);
            
            //insert user_activation
            const activationUuid = crypto.randomUUID();
            const userActivation = new UserActivation(null, activationUuid, "new", userId, null, null)
            await addUserActivation(userActivation);

            //send activation email
            await sendActivationEmail(user.email, activationUuid)

            res.status(201).json(ApiJsonResponse(["success"], null));

        }
        else
        {
            console.log("-- register user fields validation error --")
            res.status(400).json(ApiJsonResponse(null, ["register user fields validation error"]));
            return;
        }
    }catch (err){
        
    }
}



//validate user fields
//email - 3-50 valid email 
//username - 3-50 (alphanumeric)
//firstname - 3-50 (alpha)
//lastname - 3-50 (alpha)
//userPassword - 6-12 (1 upper, 1 lower, 1 number, 1 special char)
function validateUserFields(user)
{
    if (!Validation.isEmail(user.email) || !Validation.isLengthBetween(user.email, 3, 50))
        return false;

    if (!Validation.isAlphaNumeric(user.username) || !Validation.isLengthBetween(user.username, 3, 50))
        return false;

    if (!Validation.isLengthBetween(user.firstName, 3, 50))
        return false;

    if (!Validation.isLengthBetween(user.lastName, 3, 50))
        return false;

    if (!Validation.isValidPassword(user.userPassword))
        return false;

    return true;
}


async function validateUserEmail(user)
{
    try{
        const row = await db.get('SELECT * FROM users WHERE email = ?', [user.email])
        if (row)
            return false;
        else
          return true;
    }
    catch(err){
        throw err;
    }
}


async function validateUsername(user)
{
    try{
        const row = await db.get('SELECT * FROM users WHERE username = ?', [user.username])

        if (row)
            return false;
        else
            return true;
    }
    catch(err){
      throw err;
    }
}


async function addUser(user)
{
  try{
        const result = await db.run('INSERT INTO users(email, username, first_name, last_name, user_password, user_status, created_at, updated_at) \
                                values(?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)',
                                [user.email, user.username, user.firstName, user.lastName, user.userPassword, user.userStatus])

        return result.lastID;
    }
    catch(err){
        throw err;
    }
}


async function addUserActivation(userActivation)
{
  try{
      const result = await db.run('INSERT INTO user_activation(activation_uuid, activation_status, user_id, created_at, updated_at) \
                            values(?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)',
                            [userActivation.activation_uuid, userActivation.activation_status, userActivation.user_id])

      return result.lastID;
    }
    catch(err){
      throw err;
    }
}
