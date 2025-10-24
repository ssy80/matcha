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

dotenv.config();

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)

const db = await open({
  filename: '././database/matcha.db',
  driver: sqlite3.Database
});


//await getFameRating(req, res);
export const getFameRating = async(req, res) => {
    try{
        const userId = req.params.id;
        if (!userId){
            res.status(400).json(ApiJsonResponse(null, ["no user id provided"]));
            return;
        }
        if (isNaN(userId)){
            res.status(400).json(ApiJsonResponse(null, ["invalid user id"]));
            return;
        }
        const fameRating = await fameRatingByUserId(userId);
        console.log(fameRating);
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
        const likedUserId = likedData && likedData.liked_user_id;
        const isLiked = likedData && likedData.is_liked;
        if (!likedUserId){
            res.status(400).json(ApiJsonResponse(null, ["invalid liked user id"]));
            return;
        }
        if(isNaN(likedUserId)){
            res.status(400).json(ApiJsonResponse(null, ["invalid liked user id"]));
            return;
        }
        if (isNaN(isLiked)){
            res.status(400).json(ApiJsonResponse(null, ["invalid is_liked"]));
            return;
        }
        const likedHistory = new LikedHistory(null, userId, likedUserId, null, null);
        await addLikeddHistory(likedHistory, isLiked);
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
        const viewedUserId = viewedData && viewedData.viewed_user_id;
        if (!viewedUserId){
            res.status(400).json(ApiJsonResponse(null, ["invalid viewed user id"]));
            return;
        }
        if(isNaN(viewedUserId)){
            res.status(400).json(ApiJsonResponse(null, ["invalid viewed user id"]));
            return;
        }
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
        const userId = req.params.id;
        if (!userId){
            res.status(400).json(ApiJsonResponse(null, ["no user id provided"]));
            return;
        }
        if (isNaN(userId)){
            res.status(400).json(ApiJsonResponse(null, ["invalid user id"]));
            return;
        }
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
            //"email": user.email,
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


export const patchUserProfile = async (req, res) => {
    try{
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

        if (firstName && !Validation.isLengthBetween(lastName, 3, 50)){
            res.status(400).json(ApiJsonResponse(null, ["invalid firstname"]));
            return;
        }
        if (lastName && !Validation.isLengthBetween(lastName, 3, 50)){
            res.status(400).json(ApiJsonResponse(null, ["invalid lastname"]));
            return;
        }
        if (email && (!Validation.isEmail(email) || !Validation.isLengthBetween(email, 3, 50))){
            res.status(400).json(ApiJsonResponse(null, ["invalid email"]));
            return;
        }
        
        if (gender && !Validation.isValidGender(gender)){
            res.status(400).json(ApiJsonResponse(null, ["invalid gender"]));
            return;
        }
        if (biography && !Validation.isLengthBetween(biography, 1, 500)){
            res.status(400).json(ApiJsonResponse(null, ["invalid biography"]));
            return;
        }
        if (dateOfBirth && !Validation.isValidDateOfBirth(dateOfBirth, 18)){
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
            user.firstName = firstName;
        }
        if (lastName){
            user.lastName = lastName;
        }
        if (gender){
            user.gender = gender;
        }
        if (biography){
            user.biography = biography;
        }
        if (dateOfBirth){
            user.dateOfBirth = dateOfBirth;
        }
        if (email){
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
        await updateUserData(user, sexualPreferences, interests, savedPictures);
        res.status(200).json(ApiJsonResponse(["success"], null));
      }catch(err){
          console.error("Error patchUserProfile: ", err);
          res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}


async function updateUserData(user, sexualPreferences, interests, savedPictures){
    try{
        console.log("updateUserData")
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


async function addLikeddHistory(likedHistory, isLiked){
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

        const likedCountRow = await db.get('select liked_count from fame_ratings WHERE user_id = ?;', [userId]);
        const likedCount = likedCountRow.liked_count;

        const fifth = total / 5;
        let stars = Math.floor(likedCount / fifth);
        stars = Math.max(0, Math.min(5, stars));

        return {"stars":stars, "liked_count": likedCount};
    }catch(err){
        console.error("error fameRatingByUserId: ", err);
        throw (err);
    }
}