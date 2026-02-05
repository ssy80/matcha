import { db } from '../db/database.js';
import { User } from '../models/user.js';
import { Validation } from '../utils/validationUtils.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { UserActivation } from '../models/user_activation.js';
import { UserReset } from '../models/user_reset.js';
import { sendActivationEmail, sendResetEmail } from '../services/emailService.js';
import { getUserById, getUserByEmail, getUserByUsername } from './userDbService.js';
import { FameRating } from '../models/fame_rating.js';
import { UserLocation } from '../models/user_location.js'
import { UserOnline } from '../models/user_online.js';


dotenv.config();


const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;


export const resetUserPassword = async (req, res) => {
    try{
        const resetData = req.body;
        let password = resetData?.password ?? null;
        let resetUuid = resetData?.reset_uuid ?? null;
        if (password === null || typeof password !== "string" || !Validation.isValidPassword(password.trim())) {
            res.status(400).json({"success": false, "error": "invalid password"});
            return;
        }
         if (resetUuid === null || typeof resetUuid !== "string") {
            res.status(400).json({"success": false, "error": "invalid reset uuid"});
            return;
        }
        password = password.trim();
        resetUuid = resetUuid.trim();

        const userReset = await getUserResetByUuid(resetUuid);
        if (!userReset){
            res.status(409).json({"success": false, "error": "invalid reset uuid"});
            return;
        }
        const now = new Date();
        const expiredDate = new Date(userReset.expiredAt);
        if (now > expiredDate || userReset.resetStatus !== "new"){
            res.status(409).json({"success": false, "error": "reset password expired"});
            return;
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await getUserById(userReset.userId);
        user.userPassword = hashedPassword
        await updateUserPassword(user);
        userReset.resetStatus = "expired";
        await updateUserResetStatus(userReset);
        res.status(201).json({"success": true});
    }catch(err){
        console.error("error resetUserPassword: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


export const resetPasswordRequest = async (req, res) => {
    try{
        const resetData = req.body;
        let email = resetData?.email ?? null;
        if (email === null || typeof email !== "string" || !Validation.isEmail(email.trim()) || !Validation.isLengthBetween(email.trim(), 3, 50)) {
            res.status(400).json({"success": false, "error": "invalid email"});
            return;
        }
        email = email.trim();

        const user = await getUserByEmail(email);
        if (!user){
            res.status(409).json({"success": false, "error": "no user with this email"});
            return;
        }
        if (user.userStatus !== "activated"){
            res.status(409).json({"success": false, "error": "user is not activated"});
            return;
        }
        //send reset email to user
        const resetUuid = crypto.randomUUID();
        const expire_in = 10;
        const expiredAt = new Date(Date.now() + (expire_in * 60 * 1000)).toISOString();
        const userReset = new UserReset(null, resetUuid, "new", expiredAt, user.id, null, null);
        //delete old user_reset rec
        await deleteUserResets(user.id);
        await addUserResets(userReset);
        await sendResetEmail(email, resetUuid);
        res.status(201).json({"success": true});
    }catch(err){
        console.error("error resetPasswordRequest: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


export const userLogin = async (req, res) => {
    try{
        const loginData = req.body;
        let username = loginData?.username ?? null;
        let password = loginData?.password ?? null;
        
        if (username === null || typeof username !== "string" || !Validation.isAlphaNumeric(username.trim())  || !Validation.isLengthBetween(username.trim(), 3, 50)) {
            res.status(400).json({"success": false, "error": "invalid username"});
            return;
        }
        if (password === null || typeof password !== "string" || !Validation.isValidPassword(password.trim())) {
            res.status(400).json({"success": false, "error": "invalid password"});
            return;
        }
        username = username.trim();
        password = password.trim();
        
        const user = await getUserByUsername(username);
        if (!user){
            res.status(409).json({"success": false, "error": "no user with this username"});
            return;
        }
        if (user.userStatus !== "activated"){
            res.status(409).json({"success": false, "error": "user is not activated"});
            return;
        }
        const isMatch = await matchPasswords(password, user.userPassword)
        if (!isMatch){
            res.status(409).json({"success": false, "error": "passwords does not match"});
            return;
        }
        //generate jwt token
        const payload = {
            id: user.id,
            username: user.username
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({"success": true, "token": token});
    }catch (err){
        console.error("error userLogin: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}

export const userLogout = async (req, res) => {
    try {
        const userId = req.user.id;
        await db.run(`
            UPDATE user_onlines 
            SET is_online = 0, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
        `, [userId]);
        
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};


export const activateUser = async (req, res) => {
    try{
        const activateData = req.body;
        let activationUuid = activateData?.activation_uuid ?? null;
        if (activationUuid === null || typeof activationUuid !== "string") {
            res.status(400).json({"success": false, "error": "invalid activation uuid"});
            return;
        }
        activationUuid = activationUuid.trim();

        const userActivation = await getUserActivation(activationUuid);
        if (userActivation) {
            if (userActivation.activationStatus === "new") {
                const user = await getUserById(userActivation.userId);
                if (user.userStatus === "new") {
                    user.userStatus = "activated";
                    userActivation.activationStatus = "activated";
                    await updateUserActivationStatus(user, userActivation);
                    res.status(201).json({"success": true});
                }
                else
                    res.status(409).json({"success": false, "error": "invalid user status"});
            }
            else
                res.status(409).json({"success": false, "error": "invalid user activation status"});
        }
        else
            res.status(409).json({"success": false, "error": "invalid activation uuid"});

    }catch(err){
        console.error("error activateUser: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


//validate user fields
//email - 3-50 valid email 
//username - 3-50 (alphanumeric)
//firstname - 3-50 (alpha)
//lastname - 3-50 (alpha)
//userPassword - 6-12 (1 upper, 1 lower, 1 number, 1 special char)
//dateOfBirth - "YYYY-MM-DD"
export const registerUser = async (req, res) => {
    try{
        const userData = req.body;
        let email = userData?.email ?? null;
        let username = userData?.username ?? null;
        let firstName = userData?.first_name ?? null;
        let lastName = userData?.last_name ?? null;
        let userPassword = userData?.user_password ?? null;
        let dateOfBirth = userData?.date_of_birth ?? null;
        if (email === null || typeof email !== "string" || !Validation.isEmail(email.trim()) || !Validation.isLengthBetween(email.trim(), 3, 50)) {
            res.status(400).json({"success": false, "error": "invalid email"});
            return;
        }
        if (username === null || typeof username !== "string" || !Validation.isAlphaNumeric(username.trim())  || !Validation.isLengthBetween(username.trim(), 3, 50)) {
            res.status(400).json({"success": false, "error": "invalid username"});
            return;
        }
        if (firstName === null || typeof firstName !== "string" || !Validation.isLengthBetween(firstName.trim(), 3, 50)) {
            res.status(400).json({"success": false, "error": "invalid first name"});
            return;
        }
        if (lastName === null || typeof lastName !== "string" || !Validation.isLengthBetween(lastName.trim(), 3, 50)) {
            res.status(400).json({"success": false, "error": "invalid last name"});
            return;
        }
        if (userPassword === null || typeof userPassword !== "string" || !Validation.isValidPassword(userPassword.trim())) {
            res.status(400).json({"success": false, "error": "invalid password"});
            return;
        }
        if (dateOfBirth === null || typeof dateOfBirth !== "string" || !Validation.isValidDateOfBirth(dateOfBirth.trim(), 18)) {
            res.status(400).json({"success": false, "error": "invalid date of birth"});
            return;
        }
        email = email.trim();
        username = username.trim();
        firstName = firstName.trim();
        lastName = lastName.trim();
        userPassword = userPassword.trim();
        dateOfBirth = dateOfBirth.trim();
    
        const user = new User(null, email, username, firstName, lastName, null, null, dateOfBirth, null, userPassword, "new", null, null);
        const hashedPassword = await bcrypt.hash(userPassword, saltRounds);
        user.userPassword = hashedPassword;
        const isValidUsername = await isValidUsernameDb(user);
        if (!isValidUsername) {
            res.status(409).json({"success": false, "error": "username in use"});
            return;  
        }
        const isValidUserEmail = await isValidUserEmailDb(user);
        if (!isValidUserEmail) {
            res.status(409).json({"success": false, "error": "email in use"});
            return;
        }
        //insert user
        const userOnline = new UserOnline(null, null, null);
        const fameRating = new FameRating(null, 0, null, null);
        const userLocation = new UserLocation(null, null, null, "unknown", "unknown", "unknown", null, null);
        const activationUuid = crypto.randomUUID();
        const userActivation = new UserActivation(null, activationUuid, "new", null, null, null);
        const userId = await addUser(user, fameRating, userLocation, userActivation, userOnline);
        await sendActivationEmail(user.email, activationUuid);
        res.status(201).json({"success": true});
    }catch (err){
        console.error("error registerUser:", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


async function isValidUserEmailDb(user)
{
    try{
        const row = await db.get('SELECT * FROM users WHERE email = ?', [user.email]);
        if (row)
            return false;
        else
          return true;
    }
    catch(err){
        console.error("error isValidUserEmailDb: ", err);
        throw err;
    }
}


async function isValidUsernameDb(user)
{
    try{
        const row = await db.get('SELECT * FROM users WHERE username = ?', [user.username])

        if (row)
            return false;
        else
            return true;
    }
    catch(err){
        console.error("error isValidUsernameDb: ", err);
        throw err;
    }
}


async function addUser(user, fameRating, userLocation, userActivation, userOnline)
{
  try{
        await db.run("BEGIN TRANSACTION");
        const result = await db.run('INSERT INTO users(email, username, first_name, last_name, gender, biography, date_of_birth, sexual_preference, user_password, user_status, created_at, updated_at) \
                                values(?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)',
                                [user.email, user.username, user.firstName, user.lastName, user.gender, user.biography, user.dateOfBirth, user.sexualPreference, user.userPassword, user.userStatus]);
        const userId = result.lastID;
        fameRating.userId = userId;
        userLocation.userId = userId;
        userActivation.userId = userId;
        userOnline.userId = userId;
        await db.run('INSERT INTO fame_ratings(user_id, liked_count, created_at, updated_at) \
                            values(?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)',
                            [fameRating.userId, fameRating.likedCount]);
        await db.run('INSERT INTO user_locations(user_id, latitude, longitude, neighborhood, city, country, created_at, updated_at) \
                            values(?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)',
                            [userLocation.userId, userLocation.latitude, userLocation.longitude, userLocation.neighborhood,
                                userLocation.city, userLocation.country]);
        await db.run('INSERT INTO user_activations(activation_uuid, activation_status, user_id, created_at, updated_at) \
                            values(?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)',
                            [userActivation.activationUuid, userActivation.activationStatus, userActivation.userId]);
        await db.run('INSERT INTO user_onlines(user_id, created_at, updated_at) \
                            values(?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)',
                            [userOnline.userId]);
        
        await db.run("COMMIT");
        return userId;
    }
    catch(err){
        await db.run("ROLLBACK");
        console.error("error addUser: ", err);
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
        console.error("error getUserActivation: ", err);
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
        console.error("error updateUserActivationStatus:", err);
        throw err;
    }
}


async function matchPasswords(password, hashedPassword){
    try{
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }catch (err){
        console.error("error matchPasswords: ", err);
        throw err;
    }
}


async function deleteUserResets(userId)
{
  try{
        await db.run('DELETE FROM user_resets WHERE user_id = ?;', [userId]);
    }
    catch(err){
        console.error("error deleteUserResets: ", err);
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
        console.error("error addUserResets: ", err);
        throw err;
    }
}


async function getUserResetByUuid(resetUuid){
    try{
        const row = await db.get('SELECT * FROM user_resets WHERE reset_uuid = ?', [resetUuid]);

        if (row){
            const userReset = new UserReset(row.id, row.reset_uuid, row.reset_status, row.expired_at, row.user_id, row.created_at, row.updated_at);
            return userReset;
        }
        else
            return null;
    }catch(err){
        console.error("error getUserResetByUuid: ", err);
        throw err;
    }
}


async function updateUserPassword(user){
    try{
        await db.run('UPDATE users SET user_password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;', [user.userPassword, user.id]);
    }
    catch(err){
        console.error("error updateUserPassword: ", err);
        throw err;
    }
}


async function updateUserResetStatus(userReset){
    try{
        await db.run('UPDATE user_resets SET reset_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;', [userReset.resetStatus, userReset.id]);
    }
    catch(err){
        console.error("error updateUserResetStatus: ", err);
        throw err;
    }
}
