import { ApiJsonResponse } from '../utils/responseUtil.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { User } from '../models/user.js'
import { Validation } from '../utils/validationUtils.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { PictureUtil } from '../utils/pictureUtils.js';
import { getUserById, getUserByEmail } from './userDbService.js';
import { ViewedHistory } from '../models/viewed_history.js';
import { LikedHistory } from '../models/liked_history.js';
import { UserOnline } from '../models/user_online.js';

dotenv.config();

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)

const db = await open({
  filename: '././database/matcha.db',
  driver: sqlite3.Database
});


export const isUserLikedMe = async (req, res) => {
    try{
        const userId = req.user.id; //me
        let likedMeUserId = req.params?.id ?? null; //liked me id
        //console.log(likedMeUserId);
        //console.log(typeof likedMeUserId);
        //if (likedMeUserId === null || typeof Number(likedMeUserId) !== "number") {
        if (likedMeUserId === null || isNaN(likedMeUserId)) {  
            res.status(400).json(ApiJsonResponse(null, ["invalid liked me user id"]));
            return;
        }
        likedMeUserId = Number(likedMeUserId);

        const likedHistory = await getLikedHistoryDb(likedMeUserId, userId);
        if (likedHistory){
            res.status(200).json(ApiJsonResponse([true], null));
        }
        else
            res.status(200).json(ApiJsonResponse([false], null));

    }catch(err){
        console.error("error isUserLikedMe: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}


export const isUserViewedMe = async (req, res) => {
    try{
        const userId = req.user.id; //me
        let viewedMeUserId = req.params?.id ?? null; //viewed me id
        /*console.log(viewedMeUserId)
        console.log(typeof viewedMeUserId) //string "ppp"
        console.log(typeof Number(viewedMeUserId)) //why can become a number ?
        console.log(Number(viewedMeUserId))        //Nan
        console.log(typeof Number(viewedMeUserId !== "number")) // why NaN === "number"*/
        if (viewedMeUserId === null || isNaN(viewedMeUserId)) {
            res.status(400).json(ApiJsonResponse(null, ["invalid viewed me user id"]));
            return;
        }
        viewedMeUserId = Number(viewedMeUserId);

        const viewedHistory = await getViewedHistoryDb(viewedMeUserId, userId);
        if (viewedHistory){
            res.status(200).json(ApiJsonResponse([true], null));
        }
        else
            res.status(200).json(ApiJsonResponse([false], null));
    }catch(err){
        console.error("error isUserViewedMe: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}


export const getOnlineStatus = async (req, res) => {
    try{
        let userId = req.params?.id ?? null;
        //if (userId === null || typeof userId !== "number") {
        if (userId === null || isNaN(userId)) {
            res.status(400).json(ApiJsonResponse(null, ["invalid user id"]));
            return;
        }
        userId = Number(userId);
        
        const userOnline = await getUserOnlineDb(userId);
        if(!userOnline){
            res.status(400).json(ApiJsonResponse(null, ["invalid user id"]));
            return;
        }

        const data = {"user_id": userId, "updated_at": userOnline.updatedAt};
        res.status(200).json(ApiJsonResponse([data], null));
    }catch(err){
        console.error("error getOnlineStatus: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}


export const getFameRating = async(req, res) => {
    try{
        let userId = req.params?.id ?? null;
        //if (userId === null || typeof userId !== "number") {
        if (userId === null || isNaN(userId)) {
            res.status(400).json(ApiJsonResponse(null, ["invalid user id"]));
            return;
        }
        userId = Number(userId);

        const fameRating = await fameRatingByUserId(userId);
        //console.log(fameRating);
        if (!fameRating) {
            res.status(400).json(ApiJsonResponse(null, ["unable to calculate fame rating"]));
            return;
        }
        res.status(201).json(ApiJsonResponse([fameRating], null));
    }catch(err){
        console.error("error getFameRating: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}

 
export const likedProfile = async(req, res) => {
    try{
        const userId = req.user.id;
        const likedData = req.body;
        let likedUserId = likedData?.liked_user_id ?? null;
        const isLiked = likedData?.is_liked ?? null; //true/false
        //console.log(isNaN(likedUserId))
        //console.log(typeof Number(likedUserId))
        if (likedUserId === null || typeof likedUserId === "boolean" || typeof likedUserId === "string" || isNaN(likedUserId)) {
            res.status(400).json(ApiJsonResponse(null, ["invalid liked user id"]));
            return;
        }
        if (isLiked === null || typeof isLiked !== "boolean") {
            res.status(400).json(ApiJsonResponse(null, ["invalid is_liked"]));
            return;
        }
        likedUserId = Number(likedUserId);

        const user = getUserById(likedUserId);
        if (!user){
            res.status(400).json(ApiJsonResponse(null, ["invalid liked user"]));
            return;
        }

        const likedHistory = new LikedHistory(null, userId, likedUserId, null, null);
        await addLikedHistory(likedHistory, isLiked);
        res.status(201).json(ApiJsonResponse(["success"], null));
    }catch(err){
        console.error("error likedProfile: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}


export const viewedProfile = async(req, res) => {
    try{
        const userId = req.user.id;
        const viewedData = req.body;
        let viewedUserId = viewedData?.viewed_user_id ?? null;
        if (viewedUserId === null || typeof viewedUserId === "boolean" || typeof viewedUserId === "string" || isNaN(viewedUserId)) {
            res.status(400).json(ApiJsonResponse(null, ["invalid viewed user id"]));
            return;
        }
        viewedUserId = Number(viewedUserId);

        const viewedHistory = new ViewedHistory(null, userId, viewedUserId, null, null);
        await addViewedHistory(viewedHistory);
        res.status(201).json(ApiJsonResponse(["success"], null));
    }catch(err){
        console.error("error viewedProfile: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}


export const getProfileUser = async (req, res) => {
    try{
        const userId = req.user.id; 
        let viewUserId = req.params?.id ?? null;
        console.log(userId);
        console.log(viewUserId);
        if (viewUserId === null || isNaN(viewUserId)) {
            res.status(400).json(ApiJsonResponse(null, ["invalid view user id"]));
            return;
        }
        viewUserId = Number(viewUserId);

        /*if (!viewUserId){
            res.status(400).json(ApiJsonResponse(null, ["no view user id provided"]));
            return;
        }
        if (isNaN(viewUserId)){
            res.status(400).json(ApiJsonResponse(null, ["invalid view user id"]));
            return;
        }*/

        const user = await getUserById(viewUserId);
        if (!user){
            res.status(400).json(ApiJsonResponse(null, ["no such user"]));
            return;
        }
        const interests = await getUserInterestsByUserId(viewUserId);
        const sexualPreferences = await getUserSexualPreferencesByUserId(viewUserId);
        const pictures = await getUserPicturesByUserId(viewUserId);

        const data = {
            "id": viewUserId,
            "username": user.username,
            "first_name": user.firstName,
            "last_name": user.lastName,
            //"email": user.email,
            "gender": user.gender,
            "biography": user.biography,
            "date_of_birth": user.dateOfBirth,
            "interests": interests,
            "sexual_preferences": sexualPreferences,
            "pictures": pictures
        }
        console.log(data);
        //add to viewed_histories
        const viewedHistory = new ViewedHistory(null, userId, viewUserId, null, null);
        await addViewedHistory(viewedHistory);
        res.status(200).json(ApiJsonResponse([data], null));
    }catch(err){
        console.error("error getProfileUser: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}


export const getProfileMe = async (req, res) => {
    try{
        const userId = req.user.id;
        const user = await getUserById(userId);
        if (!user){
            res.status(400).json(ApiJsonResponse(null, ["no such user"]));
            return;
        }
        const interests = await getUserInterestsByUserId(userId);
        const sexualPreferences = await getUserSexualPreferencesByUserId(userId);
        const pictures = await getUserPicturesByUserId(userId);

        const data = {
            "id": userId,
            "username": user.username,
            "first_name": user.firstName,
            "last_name": user.lastName,
            "email": user.email,
            "gender": user.gender,
            "biography": user.biography,
            "date_of_birth": user.dateOfBirth,
            "interests": interests,
            "sexual_preferences": sexualPreferences,
            "pictures": pictures
        }
        console.log(data);
        res.status(200).json(ApiJsonResponse([data], null));
    }catch(err){
        console.error("error getProfileMe: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}

/*
const userId = req.user.id; 
        const profileData = req.body;
        const firstName = profileData && profileData.first_name;
        const lastName = profileData && profileData.last_name;
        const email = profileData && profileData.email;
        const gender = profileData && profileData.gender;
        const biography = profileData && profileData.biography;
        const dateOfBirth = profileData && profileData.date_of_birth;
        const sexualPreferences = profileData && profileData.sexual_preferences;
        const interests = profileData && profileData.interests;
        const pictures = profileData && profileData.pictures;
*/
export const patchUserProfile = async (req, res) => {
    try{
        const userId = req.user.id; 
        const profileData = req.body;
        let firstName = profileData?.first_name.trim() ?? null;
        let lastName = profileData?.last_name ?? null;
        let email = profileData?.email ?? null;
        let gender = profileData?.gender ?? null;
        let biography = profileData?.biography ?? null;
        let dateOfBirth = profileData?.date_of_birth ?? null;
        const sexualPreferences = profileData?.sexual_preferences ?? null;
        const interests = profileData?.interests ?? null;
        const pictures = profileData?.pictures ?? null;
        if (firstName && (typeof firstName !== "string" || !Validation.isLengthBetween(lastName.trim(), 3, 50))){
            res.status(400).json(ApiJsonResponse(null, ["invalid firstname"]));
            return;
        }
        if (lastName && (typeof lastName !== "string" || !Validation.isLengthBetween(lastName.trim(), 3, 50))){
            res.status(400).json(ApiJsonResponse(null, ["invalid lastname"]));
            return;
        }
        if (email && (typeof email !== "string" || !Validation.isEmail(email.trim()) || !Validation.isLengthBetween(email.trim(), 3, 50))){
            res.status(400).json(ApiJsonResponse(null, ["invalid email"]));
            return;
        }
        
        if (gender && (typeof gender !== "string" || !Validation.isValidGender(gender.trim()))){
            res.status(400).json(ApiJsonResponse(null, ["invalid gender"]));
            return;
        }
        if (biography && (typeof biography !== "string" || !Validation.isLengthBetween(biography.trim(), 1, 500))){
            res.status(400).json(ApiJsonResponse(null, ["invalid biography"]));
            return;
        }
        if (dateOfBirth && (typeof dateOfBirth !== "string" || !Validation.isValidDateOfBirth(dateOfBirth.trim(), 18))){
            res.status(400).json(ApiJsonResponse(null, ["invalid date of birth"]));
            return;
        }

        if (sexualPreferences && !Validation.isValidSexualPreferences(sexualPreferences)){
            res.status(400).json(ApiJsonResponse(null, ["invalid sexual preferences"]));
            return;
        }
        if (interests && !Validation.isValidInterests(interests)){
            res.status(400).json(ApiJsonResponse(null, ["invalid interests"]));
            return;
        }
        let savedPictures = null;
        if(pictures){
            savedPictures = await PictureUtil.savePictures(pictures);
            if (!savedPictures){
                res.status(400).json(ApiJsonResponse(null, ["invalid pictures"]));
                return;
            }
        }
        const user = await getUserById(userId);
        if (firstName){
            firstName = firstName.trim();
            user.firstName = firstName;
        }
        if (lastName){
            lastName = lastName.trim();
            user.lastName = lastName;
        }
        if (gender){
            gender = gender.trim();
            user.gender = gender;
        }
        if (biography){
            biography = biography.trim();
            user.biography = biography;
        }
        if (dateOfBirth){
            dateOfBirth = dateOfBirth.trim();
            user.dateOfBirth = dateOfBirth;
        }
        if (email){
            email = email.trim();
            const userByEmail = await getUserByEmail(email);
            if (!userByEmail){
                user.email = email;
            }else{
                if (userByEmail.id !== userId){
                    res.status(400).json(ApiJsonResponse(null, ["email in use"]));
                    return;
                }
            }
        }
        console.log(interests);
        await updateUserData(user, sexualPreferences, interests, savedPictures);
        res.status(200).json(ApiJsonResponse(["success"], null));
      }catch(err){
          console.error("Error patchUserProfile: ", err);
          res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}


async function updateUserData(user, sexualPreferences, interests, savedPictures){
    try{
        await db.run("BEGIN TRANSACTION");
        await db.run('UPDATE users SET first_name = ?, last_name = ?, email = ?, gender = ?, biography = ?, date_of_birth = ?, \
            updated_at = CURRENT_TIMESTAMP WHERE id = ?;',
            [user.firstName, user.lastName, user.email, user.gender, user.biography, user.dateOfBirth, user.id]);
        if (sexualPreferences){
            await db.run('DELETE FROM user_sexual_preferences WHERE user_id = ?;', [user.id]);
            for (const pref of sexualPreferences){
                await db.run('INSERT INTO user_sexual_preferences(user_id, preference) values(?,?);', [user.id, pref]);
            }
        }
        if (interests){
            await db.run('DELETE FROM user_interests WHERE user_id = ?;', [user.id]);
            for (const interest of interests){
                await db.run('INSERT INTO user_interests(user_id, interest) values(?,?);', [user.id, interest]);
            }
        }
        if (savedPictures){
            await db.run('DELETE FROM user_pictures WHERE user_id = ?;', [user.id]);
            for (const savedPic of savedPictures){
                await db.run('INSERT INTO user_pictures(user_id, picture, is_profile_picture) values(?,?,?);', [user.id, savedPic.filename, savedPic.isProfilePicture]);
            }
        }
        await db.run("COMMIT");
    }catch(err){
        await db.run("ROLLBACK");
        console.error("error updateUserData: ", err);
        throw (err);
    }
}

//? if empty?
async function getUserInterestsByUserId(userId){
    try{
        const rows = await db.all('SELECT * FROM user_interests WHERE user_id = ?', [userId]);
        const interests = rows.map(row => row.interest);
        return interests;
    }catch(err){
        console.error("error getUserInterestsByUserId: ", err);
        throw (err);
    }
}

// if empty?
async function getUserSexualPreferencesByUserId(userId){
    try{
        const rows = await db.all('SELECT * FROM user_sexual_preferences WHERE user_id = ?', [userId]);
        const sexualPreferences = rows.map(row => row.preference);
        return sexualPreferences;
    }catch(err){
        console.error("error getUserSexualPreferencesByUserId: ", err);
        throw (err);
    }
}

// if empty?
async function getUserPicturesByUserId(userId){
    try{
        const rows = await db.all('SELECT * FROM user_pictures WHERE user_id = ?', [userId]);
        const pictures = rows.map(row => ({"picture": row.picture, "is_profile_picture": row.is_profile_picture}));
        return pictures;
    }catch(err){
        console.error("error getUserPicturesByUserId: ", err);
        throw (err);
    }
}


async function addViewedHistory(viewedHistory){
    try{
        await db.run('DELETE FROM viewed_histories WHERE user_id = ? AND viewed_user_id = ?;', [viewedHistory.userId, viewedHistory.viewedUserId]);
        await db.run('INSERT INTO viewed_histories(user_id, viewed_user_id) values(?,?);', [viewedHistory.userId, viewedHistory.viewedUserId]);
    }catch(err){
        console.error("error addViewedHistory: ", err);
        throw (err);
    }
}

//check logic again
async function addLikedHistory(likedHistory, isLiked){
    try{
        const row = await db.get('SELECT * FROM liked_histories WHERE user_id = ? AND liked_user_id = ?;', [likedHistory.userId, likedHistory.likedUserId]);
        if (isLiked){
            if (!row){
                await db.run('INSERT INTO liked_histories(user_id, liked_user_id) values(?,?);', [likedHistory.userId, likedHistory.likedUserId]);
                //add fame count
                await db.run('UPDATE fame_ratings SET liked_count = liked_count + 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?;', [likedHistory.likedUserId]);
            }
        }
        else{
            if (row){
                await db.run('DELETE FROM liked_histories WHERE user_id = ? AND liked_user_id = ?;', [likedHistory.userId, likedHistory.likedUserId]);
                //remove fame count
                await db.run('UPDATE fame_ratings SET liked_count = liked_count - 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?;', [likedHistory.likedUserId]);
            }
        }
    }catch(err){
        console.error("error addLikeddHistory: ", err);
        throw (err);
    }
}


async function fameRatingByUserId(userId){
    try{
        const totalRow = await db.get('select count(*) as total from fame_ratings;');
        const total = totalRow.total;
        if (total < 1)
            return null;

        const likedCountRow = await db.get('select liked_count from fame_ratings WHERE user_id = ?;', [userId]);
        const likedCount = likedCountRow?.liked_count ?? null;
        if (likedCount === null){
            return null;
        }

        const fifth = total / 5;
        let stars = Math.floor(likedCount / fifth);

        if (likedCount === 0){
            return {"stars":0, "liked_count": likedCount};    
        }

        stars = Math.max(1, Math.min(5, stars));
        return {"stars":stars, "liked_count": likedCount};
    }catch(err){
        console.error("error fameRatingByUserId: ", err);
        throw (err);
    }
}


async function getUserOnlineDb(userId){
    try{
        const row = await db.get('select * from user_onlines WHERE user_id = ?;', [userId]);
        if(row){
            const userOnline = new UserOnline(row.user_id, row.created_at, row.updated_at);
            return userOnline;
        }
        return null;
    }catch(err){
        console.error("error getUserOnlineDb: ", err);
        throw (err);
    }
}


async function getViewedHistoryDb(viewedMeUserId, userId){
    try{
        const row = await db.get('select * from viewed_histories WHERE user_id = ? AND viewed_user_id = ?;', [viewedMeUserId, userId]);
        if(row){
            const viewedHistory = new ViewedHistory(row.id, row.user_id, row.viewed_user_id, row.created_at, row.updated_at);
            return viewedHistory;
        }
        return null;
    }catch(err){
        console.error("error getViewedHistoryDb: ", err);
        throw (err);
    }
}


//await getLikedHistoryDb(likedMeUserId, userId);
async function getLikedHistoryDb(likedMeUserId, userId){
    try{
        const row = await db.get('select * from liked_histories WHERE user_id = ? AND liked_user_id = ?;', [likedMeUserId, userId]);
        if(row){
            const likedHistory = new LikedHistory(row.id, row.user_id, row.liked_user_id, row.created_at, row.updated_at);
            return likedHistory;
        }
        return null;
    }catch(err){
        console.error("error getLikedHistoryDb: ", err);
        throw (err);
    }
}