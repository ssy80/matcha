import { ApiJsonResponse } from '../utils/responseUtil.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { User } from '../models/user.js'
import { Validation } from '../utils/validationUtils.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { PictureUtil } from '../utils/pictureUtils.js'

dotenv.config();

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)

const db = await open({
  filename: '././database/matcha.db',
  driver: sqlite3.Database
});

export const addUserProfile = async (req, res) => {
    const profileData = req.body;
    const gender = profileData && profileData.gender;
    const biography = profileData && profileData.biography;
    const sexual_preferences = profileData && profileData.sexual_preferences;
    const interests = profileData && profileData.interests;
    const pictures = profileData && profileData.pictures;
    if (!Validation.isValidGender(gender)){
      res.status(400).json(ApiJsonResponse(null, ["invalid gender"]));
      return;
    }
    if (!Validation.isValidSexualPreferences(sexual_preferences)){
      res.status(400).json(ApiJsonResponse(null, ["invalid sexual preferences"]));
      return;
    }
    if (!Validation.isValidInterests(interests)){
      res.status(400).json(ApiJsonResponse(null, ["invalid interests"]));
      return;
    }
    if (!Validation.isLengthBetween(biography, 1, 500)){
      res.status(400).json(ApiJsonResponse(null, ["invalid biography"]));
      return;
    }
    let savedPictures = null;
    if(!pictures)
    {
      savedPictures = null;
      console.log("pictures: ", pictures);
    }
    else{
      savedPictures = PictureUtil.savePictures(pictures);
    }
      console.log(req.user);

    //console.log(profileData);
    res.status(200).json(ApiJsonResponse(["success"], null));
}