import { ApiJsonResponse } from '../utils/responseUtil.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { User } from '../models/user.js'
import { Validation } from '../utils/validationUtils.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { UserActivation } from '../models/user_activation.js';
import { UserReset } from '../models/user_reset.js';
import { sendActivationEmail, sendResetEmail } from '../services/emailService.js';

dotenv.config();

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)

const db = await open({
  filename: '././database/matcha.db',
  driver: sqlite3.Database
});

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1h"; // can be "15m", "1h", "7d", etc.

export const resetPasswordRequest = async (req, res) => {
    try{
        const resetData = req.body;
        if (!resetData){
            res.status(400).json(ApiJsonResponse(null, ["empty body"]));
            return;
        }
        const email = resetData.email;
        if(!email){
            res.status(400).json(ApiJsonResponse(null, ["no email provided"]));
            return;
        }
        //get user
        const user = await getUserByEmail(email);
        if (!user){
            res.status(400).json(ApiJsonResponse(null, ["no user with this email"]));
            return;
        }
        if (user.userStatus !== "activated"){
            res.status(400).json(ApiJsonResponse(null, ["user is not activated"]));
            return;
        }
        // need delete old user_reset record ?
        //send reset email to user
        const resetUuid = crypto.randomUUID();
        const expire_in = 10;
        const expiredAt = new Date(Date.now() + (expire_in * 60 * 1000)).toISOString();
        const userReset = new UserReset(null, resetUuid, "new", expiredAt, user.id, null, null);
        //delete old user_reset rec with status "new"
        await deleteUserResets(user.id);
        await addUserResets(userReset);
        //console.log(userReset);
        await sendResetEmail(email, resetUuid);
        res.status(201).json(ApiJsonResponse(["success"], null));

    }catch(err){
        console.error("internal server error: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}

export const userLogin = async (req, res) => {
    try{
        const loginData = req.body;
        if (!loginData){
            res.status(400).json(ApiJsonResponse(null, ["empty body"]));
            return;
        }
        let username = loginData.username;
        let password = loginData.password;
        if (!username || !password){
            res.status(400).json(ApiJsonResponse(null, ["incorrect login parameters provided"]));
            return;
        }
        username = username.trim();
        password = password.trim();
        //get user by username
        const user = await getUserByUsername(username);
        if (!user){
            res.status(400).json(ApiJsonResponse(null, ["no user with this username"]));
            return;
        }
        if (user.userStatus !== "activated"){
            res.status(400).json(ApiJsonResponse(null, ["user is not activated"]));
            return;
        }
        //match password
        const isMatch = await matchPasswords(password, user.userPassword)
        if (!isMatch){
            res.status(400).json(ApiJsonResponse(null, ["passwords does not match"]));
            return;
        }
        //generate jwt token
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json(ApiJsonResponse([{token}], null));
    }catch (err){
        console.error("internal server error: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}


export const activateUser = async (req, res) => {
    try{
        const activationUuid = req.query.activation_uuid;
        if (!activationUuid){
            res.status(400).json(ApiJsonResponse(null, ["no activation uuid"]));
            return;
        }
        const userActivation = await getUserActivation(activationUuid.trim());
        if (userActivation) {
            if (userActivation.activationStatus === "new") {
                const user = await getUserById(userActivation.userId);
                if (user.userStatus === "new") {
                    user.userStatus = "activated";
                    userActivation.activationStatus = "activated";
                    await updateUserActivationStatus(user, userActivation);
                    res.status(200).json(ApiJsonResponse(["success"], null));
                }
                else
                    res.status(409).json(ApiJsonResponse(null, ["invalid user status"]));
            }
            else
                res.status(409).json(ApiJsonResponse(null, ["invalid user activation status"]));
        }
        else
            res.status(400).json(ApiJsonResponse(null, ["invalid activation uuid"]));
    }catch(err){
        console.error("internal server error: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}


export const registerUser = async (req, res) => {
    try{
        const userData = req.body;
        if (!userData){
            res.status(400).json(ApiJsonResponse(null, ["empty body"]));
            return;
        }
        let email = userData.email;
        let username = userData.username;
        let firstName = userData.first_name;
        let lastName = userData.last_name;
        let userPassword = userData.user_password;
        if (!email || !username || !firstName || !lastName || !userPassword){
            res.status(400).json(ApiJsonResponse(null, ["incorrect user parameters provided"]));
            return;
        }
        email = email.trim();
        username = username.trim();
        firstName = firstName.trim();
        lastName = lastName.trim();
        userPassword = userPassword.trim();
        const user = new User(null, email, username, firstName, lastName, userPassword, "new", null, null);
        
        if (validateUserFields(user)) {
            const hashedPassword = await bcrypt.hash(userPassword, saltRounds);
            user.userPassword = hashedPassword
            const isValidUsername = await validateUsername(user);
            if (!isValidUsername) {
                res.status(409).json(ApiJsonResponse(null, ["username in use"]));
                return;  
            }
            const isValidUserEmail = await validateUserEmail(user);
            if (!isValidUserEmail) {
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

        }else {
            //console.log("validation error with user fields")
            res.status(400).json(ApiJsonResponse(null, ["validation error with user fields"]));
            return;
        }

    }catch (err){
        console.error("internal server error:", err);
        return res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
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
        console.error("error db:", err);
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
        console.error("error db:", err);
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
        console.error("error db:", err);
        throw err;
    }
}


async function addUserActivation(userActivation)
{
  try{
        const result = await db.run('INSERT INTO user_activations(activation_uuid, activation_status, user_id, created_at, updated_at) \
                            values(?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)',
                            [userActivation.activationUuid, userActivation.activationStatus, userActivation.userId])

        return result.lastID;
    }
    catch(err){
        console.error("error db:", err);
        throw err;
    }
}


async function getUserActivation(activationUuid)
{
    try{
        const row = await db.get('SELECT * FROM user_activations WHERE activation_uuid = ?', [activationUuid])

        if (row){
            const userActivation = new UserActivation(row.id, row.activation_uuid, row.activation_status, row.user_id, row.created_at, row.updated_at);
            return userActivation;
        }
        else
            return null;
    }
    catch(err){
        console.error("error db:", err);
        throw err;
    }
}


async function getUserById(userId)
{
    try{
        const row = await db.get('SELECT * FROM users WHERE id = ?', [userId])

        if (row){
            const user = new User(row.id, row.email, row.username, row.first_name, row.last_name, row.user_password, row.user_status, row.created_at, row.updated_at);
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


async function getUserByUsername(username)
{
    try{
        const row = await db.get('SELECT * FROM users WHERE username = ?', [username])

        if (row){
            const user = new User(row.id, row.email, row.username, row.first_name, row.last_name, row.user_password, row.user_status, row.created_at, row.updated_at);
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


async function matchPasswords(password, hashedPassword){
    try{
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }catch (err){
        console.error("error bcrypt:", err);
        throw err;
    }
}


async function getUserByEmail(email)
{
    try{
        const row = await db.get('SELECT * FROM users WHERE email = ?', [email])

        if (row){
            const user = new User(row.id, row.email, row.username, row.first_name, row.last_name, row.user_password, row.user_status, row.created_at, row.updated_at);
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


async function deleteUserResets(userId)
{
  try{
        await db.run('DELETE FROM user_resets WHERE user_id = ?;', [userId]);
    }
    catch(err){
        console.error("error db:", err);
        throw err;
    }
}


async function addUserResets(userReset)
{
  try{
        await db.run('INSERT INTO user_resets(reset_uuid, reset_status, expired_at, user_id, created_at, updated_at) \
                            values(?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)',
                            [userReset.resetUuid, userReset.resetStatus, userReset.expiredAt, userReset.userId])
    }
    catch(err){
        console.error("error db:", err);
        throw err;
    }
}
