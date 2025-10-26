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
import { UserBlocked } from '../models/user_blocked.js';
import { getUserLocationByUserId } from '../services/locationService.js';
import { getUserInterestsByUserId, getUserSexualPreferencesByUserId } from '../services/profileService.js';

dotenv.config();

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)

const db = await open({
  filename: '././database/matcha.db',
  driver: sqlite3.Database
});

//getSuggestedProfiles(req, res)
export const getSuggestedProfiles = async (req, res) =>{
    try{
        const userId = req.user.id;

        //get all stuffs of this user
        const user = await getUserById(userId);   //dob, age
        const interests = await getUserInterestsByUserId(userId);                   //["#music", "#movie"]
        const sexualPreferences = await getUserSexualPreferencesByUserId(userId);   //["male", "female", "others"]
        //const pictures = await getUserPicturesByUserId(viewUserId);
        const userLocation = await getUserLocationByUserId(userId);

        console.log(user);
        console.log(userLocation);
        console.log(interests);
        console.log(sexualPreferences);

        //get users near to userLocation within 10km, 20km, 30km, rest
        //then check matching interest tag
        

        res.status(200).json(ApiJsonResponse(["success"], null));
    }catch(err){
        console.error("error getLikedMeList: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}

//getUserLocationByUserId(userId);
