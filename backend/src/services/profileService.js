import { db } from '../db/database.js';
import { Validation } from '../utils/validationUtils.js';
import dotenv from 'dotenv';
import { PictureUtil } from '../utils/pictureUtils.js';
import { getUserById, getUserByEmail } from './userDbService.js';
import { ViewedHistory } from '../models/viewed_history.js';
import { LikedHistory } from '../models/liked_history.js';
import { UserOnline } from '../models/user_online.js';
import { UserBlocked } from '../models/user_blocked.js';
import { UserFaked } from '../models/user_faked.js';
import { getUserLocationByUserId, getDistanceKm } from './locationService.js';
import { Event } from '../models/event.js';
import { addEvent } from './eventService.js';


dotenv.config();

const IMAGE_URL = `${process.env.API_HOST_URL}:${process.env.API_HOST_PORT}${process.env.PUBLIC_IMAGE_DIR}`;


export const fakedProfile = async (req, res) =>{
    try{
        const userId = req.user.id;
        const fakedData = req.body;
        let fakedUserId = fakedData?.faked_user_id ?? null;
        const isfaked = fakedData?.is_faked ?? null;
        if (fakedUserId == null || typeof fakedUserId !== "number" || !Number.isInteger(fakedUserId)) {
            res.status(400).json({"success": false, "error": "invalid faked user id"});
            return;
        }
        if (isfaked == null || typeof isfaked !== "boolean") {
            res.status(400).json({"success": false, "error": "invalid is_faked"});
            return;
        }
        fakedUserId = Number(fakedUserId);

        const toFakedUser = await getUserById(fakedUserId);
        if (toFakedUser == null){
            res.status(409).json({"success": false, "error": "invalid faked user"});
            return;
        }
        if (userId === fakedUserId){
            res.status(409).json({"success": false, "error": "cannot faked ownself"});
            return;
        }

        const userFaked = new UserFaked(null, userId, fakedUserId, null, null);
        console.log(userFaked)
        await addUserFaked(userFaked, isfaked);
        res.status(201).json({"success": true});
    }catch(err){
        console.error("error fakedProfile: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


export const getLikedMeList = async (req, res) =>{
    try{
        const userId = req.user.id;
        const likedMeList= await getLikedMeListDb(userId);
        res.status(200).json({"success": true, "liked_me_list": likedMeList});
    }catch(err){
        console.error("error getLikedMeList: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


export const getViewedMeList = async (req, res) =>{
    try{
        const userId = req.user.id;
        const viewedMeList= await getViewedMeListDb(userId);
        res.status(200).json({"success": true, "viewed_me_list": viewedMeList});
    }catch(err){
        console.error("error getViewedMeList: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


export const blockedProfile = async (req, res) =>{
    try{
        const userId = req.user.id;
        const blockedData = req.body;
        let blockedUserId = blockedData?.blocked_user_id ?? null;
        const isBlocked = blockedData?.is_blocked ?? null;
        if (blockedUserId == null || typeof blockedUserId !== "number" || !Number.isInteger(blockedUserId)) {    
            res.status(400).json({"success": false, "error": "invalid blocked user id"});
            return;
        }
        if (isBlocked == null || typeof isBlocked !== "boolean") {
            res.status(400).json({"success": false, "error": "invalid is_blocked"});
            return;
        }
        blockedUserId = Number(blockedUserId);

        const toBlockedUser = await getUserById(blockedUserId);
        if (!toBlockedUser){
            res.status(409).json({"success": false, "error": "invalid blocked user"});
            return;
        }
        if (userId === blockedUserId){
            res.status(409).json({"success": false, "error": "cannot block ownself"});
            return;
        }

        const userBlocked = new UserBlocked(null, userId, blockedUserId, null, null);
        await addUserBlocked(userBlocked, isBlocked);
        res.status(201).json({"success": true});
    }catch(err){
        console.error("error blockedProfile: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


export const isUserLikedMe = async (req, res) => {
    try{
        const userId = req.user.id;
        let likedMeUserId = req.params?.id ?? null;
        likedMeUserId = likedMeUserId !== null ? Number(likedMeUserId) : null;
        if (likedMeUserId === null || isNaN(likedMeUserId) || !Number.isInteger(likedMeUserId)) {
            res.status(400).json({"success": false, "error": "invalid liked me user id"});
            return;
        }

        const likedHistory = await getLikedHistoryDb(likedMeUserId, userId);
        if (likedHistory){
            res.status(200).json({"success": true, "is_liked_me": true});
        }
        else
            res.status(200).json({"success": true, "is_liked_me": false});

    }catch(err){
        console.error("error isUserLikedMe: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


export const isUserViewedMe = async (req, res) => {
    try{
        const userId = req.user.id;
        let viewedMeUserId = req.params?.id ?? null;
        viewedMeUserId = viewedMeUserId !== null ? Number(viewedMeUserId) : null;
        if (viewedMeUserId === null || isNaN(viewedMeUserId) || !Number.isInteger(viewedMeUserId)) {
            res.status(400).json({"success": false, "error": "invalid viewed me user id"});
            return;
        }

        const viewedHistory = await getViewedHistoryDb(viewedMeUserId, userId);
        if (viewedHistory){
            res.status(200).json({"success": true, "is_viewed_me": true});
        }
        else
            res.status(200).json({"success": true, "is_viewed_me": false});
    }catch(err){
        console.error("error isUserViewedMe: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


export const getOnlineStatus = async (req, res) => {
    try{
        let userId = req.params?.id ?? null;
        userId = userId !== null ? Number(userId) : null;
        if (userId === null || isNaN(userId) || !Number.isInteger(userId)) {
            res.status(400).json({"success": false, "error": "invalid user id"});
            return;
        }
        
        const userOnline = await getUserOnlineDb(userId);
        if(!userOnline){
            res.status(409).json({"success": false, "error": "invalid user id"});
            return;
        }
        //const data = {"user_id": userId, "updated_at": userOnline.updatedAt};
        res.status(200).json({"success": true, "last_seen": userOnline.updatedAt});
    }catch(err){
        console.error("error getOnlineStatus: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


export const getFameRating = async(req, res) => {
    try{
        let userId = req.params?.id ?? null;
        userId = userId !== null ? Number(userId) : null;
        if (userId === null || isNaN(userId) || !Number.isInteger(userId)) {
            res.status(400).json({"success": false, "error": "invalid user id"});
            return;
        }

        const fameRating = await fameRatingByUserId(userId);
        if (!fameRating) {
            res.status(409).json({"success": false, "error": "unable to calculate fame rating"});
            return;
        }
        res.status(200).json({"success": true, "fame_rating": fameRating});
    }catch(err){
        console.error("error getFameRating: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}

 
export const likedProfile = async(req, res) => {
    try{
        const userId = req.user.id;
        const likedData = req.body;
        let likedUserId = likedData?.liked_user_id ?? null;
        const isLiked = likedData?.is_liked ?? null;
        if (likedUserId == null || typeof likedUserId !== "number"|| !Number.isInteger(likedUserId)){ 
            res.status(400).json({"success": false, "error": "invalid liked user id"});
            return;
        }
        if (isLiked == null || typeof isLiked !== "boolean") {
            res.status(400).json({"success": false, "error": "invalid is_liked"});
            return;
        }

        const likedUser = await getUserById(likedUserId);
        if (likedUser == null){
            res.status(409).json({"success": false, "error": "invalid liked user"});
            return;
        }
        //check got profile picture
        const likedUserPictures = await getUserPicturesByUserId(likedUserId);
        let likedUserProfilePic = false;
        for(const pic of likedUserPictures){
            if (pic.is_profile_picture === 1){
                likedUserProfilePic = true;
                break;
            }
        }
        if (!likedUserProfilePic){
            res.status(409).json({"success": false, "error": "no profile picture"});
            return;
        }
        const userPictures = await getUserPicturesByUserId(userId); //ownself got profile pic?
        let userProfilePic = false;
        for(const pic of userPictures){
            if (pic.is_profile_picture === 1){
                userProfilePic = true;
                break;
            }
        }
        if (!userProfilePic){
            res.status(409).json({"success": false, "error": "no profile picture"});
            return;
        }
        if (userId === likedUserId){
            res.status(409).json({"success": false, "error": "cannot liked ownself"});
            return;
        }

        const likedHistory = new LikedHistory(null, userId, likedUserId, null, null);
        await addLikedHistory(likedHistory, isLiked);
        res.status(201).json({"success": true});
    }catch(err){
        console.error("error likedProfile: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}



export const getProfileUser = async (req, res) => {
    try{
        const userId = req.user.id; 
        let viewUserId = req.params?.id ?? null;
        viewUserId = viewUserId !== null ? Number(viewUserId) : null;
        if (viewUserId === null || isNaN(viewUserId) || !Number.isInteger(viewUserId)) {
            res.status(400).json({"success": false, "error": "invalid view user id"});
            return;
        }

        const viewedUser = await getUserById(viewUserId);
        if (!viewedUser){
            res.status(409).json({"success": false, "error": "no such user"});
            return;
        }
        const age = calculateAge(viewedUser.dateOfBirth);
        const interests = await getUserInterestsByUserId(viewUserId);
        const pictures = await getUserPicturesByUserId(viewUserId);
        const userLocation = await getUserLocationByUserId(userId);
        const viewedUserLocation = await getUserLocationByUserId(viewUserId);

        let distanceKm = getDistanceKm(userLocation.latitude, userLocation.longitude, viewedUserLocation.latitude, viewedUserLocation.longitude);
        distanceKm = parseFloat(distanceKm.toFixed(2));

        const location = {
            "latitude": viewedUserLocation.latitude,
            "longitude": viewedUserLocation.longitude,
            "neighborhood": viewedUserLocation.neighborhood,
            "city": viewedUserLocation.city,
            "country": viewedUserLocation.country
        };

        const fameRating = await fameRatingByUserId(viewUserId);
        const userOnline = await getUserOnlineDb(viewUserId);

        const likedMeHistory = await getLikedHistoryDb(viewUserId, userId);
        const iLikedHistory = await getLikedHistoryDb(userId, viewUserId);
        let isLikedMe = false;
        let isILiked = false;
        if (likedMeHistory){
            isLikedMe = true;
        }
        if (iLikedHistory){
            isILiked = true;
        }

        let isBlocked = false;
        const userBlocked = await getUserBlocked(userId, viewUserId);
        if (userBlocked){
            isBlocked = true;
        }

        pictures.forEach(pic =>{
            if (pic.picture){
                pic.picture = `${IMAGE_URL}${pic.picture}`;
            }
        });
        
        const data = {
            "id": viewUserId,
            "username": viewedUser.username,
            "first_name": viewedUser.firstName,
            "last_name": viewedUser.lastName,
            "gender": viewedUser.gender,
            "biography": viewedUser.biography,
            "date_of_birth": viewedUser.dateOfBirth,
            "age": age,
            "interests": interests,
            "sexual_preference": viewedUser.sexualPreference,
            "pictures": pictures,
            "location": location,
            "distance_km": distanceKm,
            "fame_rating": fameRating,
            "last_seen": userOnline?.updatedAt ?? null,
            "is_online": userOnline.is_online === 1,
            "is_liked_me": isLikedMe,
            "is_i_liked": isILiked,
            "is_blocked": isBlocked
        }

        if (userId !== viewUserId){
            const viewedHistory = new ViewedHistory(null, userId, viewUserId, null, null);
            await addViewedHistory(viewedHistory);

            try {
                await addEvent({
                    userId: viewUserId,
                    fromUserId: userId,
                    eventType: 'viewed_me',
                    eventStatus: 'new'
                });
            } catch (notifyErr) {
                console.error("Failed to create view notification:", notifyErr);
            }
        }

        res.status(200).json({"success": true, "profile": data});
    }catch(err){
        console.error("error getProfileUser: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


export const getProfileMe = async (req, res) => {
    try{
        const userId = req.user.id;
        const user = await getUserById(userId);
        if (!user){
            res.status(409).json({"success": false, "error": "no such user"});
            return;
        }
        const age = calculateAge(user.dateOfBirth);
        const interests = await getUserInterestsByUserId(userId);
        const pictures = await getUserPicturesByUserId(userId);
        const userOnline = await getUserOnlineDb(userId);

        pictures.forEach(pic =>{
            if (pic.picture){
                pic.picture = `${IMAGE_URL}${pic.picture}`;
            }
        });

        const data = {
            "id": userId,
            "username": user.username,
            "first_name": user.firstName,
            "last_name": user.lastName,
            "email": user.email,
            "gender": user.gender,
            "biography": user.biography,
            "date_of_birth": user.dateOfBirth,
            "age": age,
            "interests": interests,
            "sexual_preference": user.sexualPreference,
            "pictures": pictures,
            "last_seen": userOnline?.updatedAt ?? null,
            "is_online": userOnline.is_online === 1
        }
        res.status(200).json({"success": true, "profile": data});
    }catch(err){
        console.error("error getProfileMe: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


export const patchUserProfile = async (req, res) => {
    try{
        const userId = req.user.id; 
        const profileData = req.body;
        let firstName = profileData?.first_name ?? null;
        let lastName = profileData?.last_name ?? null;
        let email = profileData?.email ?? null;
        let gender = profileData?.gender ?? null;
        let biography = profileData?.biography ?? null;
        let dateOfBirth = profileData?.date_of_birth ?? null;
        let sexualPreference = profileData?.sexual_preference ?? null;
        const interests = profileData?.interests ?? null;
        const pictures = profileData?.pictures ?? null;
        if (firstName != null && (typeof firstName !== "string" || !Validation.isLengthBetween(firstName.trim(), 3, 50))){
            res.status(400).json({"success": false, "error": "invalid firstname"});
            return;
        }
        if (lastName != null && (typeof lastName !== "string" || !Validation.isLengthBetween(lastName.trim(), 3, 50))){
            res.status(400).json({"success": false, "error": "invalid lastname"});
            return;
        }
        if (email != null && (typeof email !== "string" || !Validation.isEmail(email.trim()) || !Validation.isLengthBetween(email.trim(), 3, 50))){
            res.status(400).json({"success": false, "error": "invalid email"});
            return;
        }
        if (gender != null && (typeof gender !== "string" || !Validation.isValidGender(gender.trim()))){
            res.status(400).json({"success": false, "error": "invalid gender"});
            return;
        }
        if (biography != null && (typeof biography !== "string" || !Validation.isLengthBetween(biography.trim(), 1, 500))){
            res.status(400).json({"success": false, "error": "invalid biography"});
            return;
        }
        if (dateOfBirth != null && (typeof dateOfBirth !== "string" || !Validation.isValidDateOfBirth(dateOfBirth.trim(), 18))){
            res.status(400).json({"success": false, "error": "invalid date of birth"});
            return;
        }
        if (sexualPreference != null && !Validation.isValidSexualPreference(sexualPreference)){
            res.status(400).json({"success": false, "error": "invalid sexual preferences"});
            return;
        }
        if (interests != null && !Validation.isValidInterests(interests)){
            res.status(400).json({"success": false, "error": "invalid interests"});
            return;
        }
        let savedPictures = null;
        if(pictures != null){
            savedPictures = await PictureUtil.savePictures(pictures);
            if (!savedPictures){
                res.status(400).json({"success": false, "error": "invalid pictures"});
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
        if (sexualPreference){
            sexualPreference = sexualPreference.trim();
            user.sexualPreference = sexualPreference;
        }
        if (email){
            email = email.trim();
            const userByEmail = await getUserByEmail(email);
            if (!userByEmail){
                user.email = email;
            }else{
                if (userByEmail.id !== userId){
                    res.status(409).json({"success": false, "error": "email in use"});
                    return;
                }
            }
        }
        await updateUserData(user, interests, savedPictures);
        res.status(201).json({"success": true});
      }catch(err){
          console.error("error patchUserProfile: ", err);
          res.status(500).json({"success": false, "error": "internal server error"});
    }
}


async function updateUserData(user, interests, savedPictures){
    try{
        await db.run("BEGIN TRANSACTION");
        await db.run('UPDATE users SET first_name = ?, last_name = ?, email = ?, gender = ?, biography = ?, date_of_birth = ?, \
            sexual_preference = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;',
            [user.firstName, user.lastName, user.email, user.gender, user.biography, user.dateOfBirth, user.sexualPreference, user.id]);
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


export const getUserInterestsByUserId = async (userId) => {
    try{
        const rows = await db.all('SELECT * FROM user_interests WHERE user_id = ?', [userId]);
        const interests = rows.map(row => row.interest);
        return interests;
    }catch(err){
        console.error("error getUserInterestsByUserId: ", err);
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
        const row = await db.get('SELECT 1 FROM viewed_histories WHERE user_id = ? AND viewed_user_id = ?;', [viewedHistory.userId, viewedHistory.viewedUserId]);
        if (!row){
            await db.run('INSERT INTO viewed_histories(user_id, viewed_user_id) values(?,?);', [viewedHistory.userId, viewedHistory.viewedUserId]);
            const event = new Event(null, viewedHistory.viewedUserId, viewedHistory.userId, "viewed_me", "new", null, null);
            await addEvent(event);
        }
    }catch(err){
        console.error("error addViewedHistory: ", err);
        throw (err);
    }
}


async function addLikedHistory(likedHistory, isLiked){
    try{
        const row = await db.get('SELECT * FROM liked_histories WHERE user_id = ? AND liked_user_id = ?;', [likedHistory.userId, likedHistory.likedUserId]);
        if (isLiked){
            if (!row){
                await db.run('INSERT INTO liked_histories(user_id, liked_user_id) values(?,?);', [likedHistory.userId, likedHistory.likedUserId]);
                //add fame count
                await db.run('UPDATE fame_ratings SET liked_count = liked_count + 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?;', [likedHistory.likedUserId]);

                const event = new Event(null, likedHistory.likedUserId, likedHistory.userId, "liked_me", "new", null, null);
                await addEvent(event);
                
                //check connected
                const likedRow = await db.get('SELECT 1 FROM liked_histories WHERE user_id = ? AND liked_user_id = ?;', [likedHistory.likedUserId, likedHistory.userId]);
                if (likedRow){
                    const connectedEvent = new Event(null, likedHistory.likedUserId, likedHistory.userId, "connected", "new", null, null);
                    await addEvent(connectedEvent);
                }
            }
        }
        else{
            if (row){
                await db.run('DELETE FROM liked_histories WHERE user_id = ? AND liked_user_id = ?;', [likedHistory.userId, likedHistory.likedUserId]);
                //remove fame count
                await db.run('UPDATE fame_ratings SET liked_count = liked_count - 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?;', [likedHistory.likedUserId]);
                
                //check disconnect
                const likedRow = await db.get('SELECT 1 FROM liked_histories WHERE user_id = ? AND liked_user_id = ?;', [likedHistory.likedUserId, likedHistory.userId]);
                if (likedRow){
                    const disconnectedEvent = new Event(null, likedHistory.likedUserId, likedHistory.userId, "disconnected", "new", null, null);
                    await addEvent(disconnectedEvent);
                }
            }
        }
    }catch(err){
        console.error("error addLikeddHistory: ", err);
        throw (err);
    }
}


async function fameRatingByUserId(userId){
    try{        
        const total = await getTotalUsers();
        if (total < 1)
            return null;

        const likedCount = await getUserLikedCount(userId);
        if (likedCount === null){
            return null;
        }

        const stars = getStars(total, likedCount);
        
        return {"stars":stars, "liked_count": likedCount};
    }catch(err){
        console.error("error fameRatingByUserId: ", err);
        throw (err);
    }
}


export function getStars(total, likedCount){

    if (total < 1 || likedCount < 1){
        return 0;
    }

    const fifth = total / 5;
    let stars = Math.ceil(likedCount / fifth); 

    stars = Math.max(1, Math.min(5, stars));
    return stars;
}


export async function getUserLikedCount(userId){
    try{
        const row = await db.get('SELECT liked_count from fame_ratings WHERE user_id = ?;', [userId]);
        if (!row){
            return null;
        }
        else
            return row.liked_count;
    }catch(err){
        console.error("error getUserLikedCount: ", err);
        throw err;
    }
}


export async function getTotalUsers(){
    try{
        const row = await db.get('SELECT count(*) as total from fame_ratings;');
        let total = 0;
        if (row)
            total = row.total;
        return total;
    }catch(err){
        console.error("error getTotalUsers: ", err);
        throw err;
    }
}


async function getUserOnlineDb(userId){
    try{
        const row = await db.get('SELECT * FROM user_onlines WHERE user_id = ?;', [userId]);
        if(row){
            const userOnline = new UserOnline(row.user_id, row.is_online, row.created_at, row.updated_at);
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
        const row = await db.get('SELECT * FROM viewed_histories WHERE user_id = ? AND viewed_user_id = ?;', [viewedMeUserId, userId]);
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


export async function getLikedHistoryDb(likedMeUserId, userId){
    try{
        const row = await db.get('SELECT * FROM liked_histories WHERE user_id = ? AND liked_user_id = ?;', [likedMeUserId, userId]);
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


async function addUserBlocked(userBlocked, isBlocked){
    try{
        const row = await db.get('SELECT * FROM user_blockeds WHERE user_id = ? AND blocked_user_id = ?;', [userBlocked.userId, userBlocked.blockedUserId]);
        if (isBlocked){
            if (!row){
                await db.run('INSERT INTO user_blockeds(user_id, blocked_user_id) values(?,?);', [userBlocked.userId, userBlocked.blockedUserId]);
            }
        }
        else{
            if (row){
                await db.run('DELETE FROM user_blockeds WHERE user_id = ? AND blocked_user_id = ?;', [userBlocked.userId, userBlocked.blockedUserId]);
            }
        }
    }catch(err){
        console.error("error addUserBlocked: ", err);
        throw (err);
    }
}


async function getViewedMeListDb(userId) {
    try {
        const query = `
            SELECT 
                v.user_id, 
                v.updated_at, 
                u.username, 
                u.first_name, 
                u.last_name, 
                p.picture
            FROM viewed_histories v 
            INNER JOIN users u ON v.user_id = u.id 
            LEFT JOIN user_pictures p ON p.user_id = u.id AND p.is_profile_picture = 1
            WHERE v.viewed_user_id = ? 
            ORDER BY v.updated_at DESC;
        `;
        
        const rows = await db.all(query, [userId]);
        
        return rows.map((row) => ({
            user_id: row.user_id,
            username: row.username,
            first_name: row.first_name,
            last_name: row.last_name,
            updated_at: row.updated_at,
            picture: row.picture ? `${IMAGE_URL}${row.picture}` : null
        }));
    } catch(err) {
        console.error("error getViewedMeListDb: ", err);
        throw (err);
    }
}


async function getLikedMeListDb(userId) {
    try {
        const query = `
            SELECT 
                v.user_id, 
                v.updated_at, 
                u.username, 
                u.first_name, 
                u.last_name, 
                p.picture
            FROM liked_histories v 
            INNER JOIN users u ON v.user_id = u.id 
            LEFT JOIN user_pictures p ON p.user_id = u.id AND p.is_profile_picture = 1
            WHERE v.liked_user_id = ? 
            ORDER BY v.updated_at DESC;
        `;

        const rows = await db.all(query, [userId]);

        return rows.map((row) => ({
            user_id: row.user_id,
            username: row.username,
            first_name: row.first_name,
            last_name: row.last_name,
            updated_at: row.updated_at,
            picture: row.picture ? `${IMAGE_URL}${row.picture}` : null
        }));
    } catch(err) {
        console.error("error getLikedMeListDb: ", err);
        throw (err);
    }
}


async function addUserFaked(userFaked, isFaked){
    try{
        const row = await db.get('SELECT * FROM user_fakeds WHERE user_id = ? AND faked_user_id = ?;', [userFaked.userId, userFaked.fakedUserId]);
        if (isFaked){
            if (!row){
                await db.run('INSERT INTO user_fakeds(user_id, faked_user_id) values(?,?);', [userFaked.userId, userFaked.fakedUserId]);
            }
        }
        else{
            if (row){
                await db.run('DELETE FROM user_fakeds WHERE user_id = ? AND faked_user_id = ?;', [userFaked.userId, userFaked.fakedUserId]);
            }
        }
    }catch(err){
        console.error("error addUserFaked: ", err);
        throw (err);
    }
}


export function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();

    // Check if the birthday hasn't happened yet this year
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}


export async function getUserBlocked(userId, blockdUserId){
    try{
        const row = await db.get('SELECT * FROM user_blockeds WHERE user_id = ? AND blocked_user_id = ?;', [userId, blockdUserId]);
        if(row){
            const userBlocked = new UserBlocked(row.id, row.user_id, row.blocked_user_id, row.created_at, row.updated_at);
            return userBlocked;
        }
        return null;
    }catch(err){
        console.error("error getUserBlocked: ", err);
        throw (err);
    }
}

export const getMatches = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            SELECT u.id, u.username, u.first_name, u.last_name, p.picture 
            FROM users u
            JOIN liked_histories lh1 ON lh1.liked_user_id = u.id AND lh1.user_id = ? 
            JOIN liked_histories lh2 ON lh2.user_id = u.id AND lh2.liked_user_id = ?
            LEFT JOIN user_pictures p ON p.user_id = u.id AND p.is_profile_picture = 1
        `;
        const matches = await db.all(query, [userId, userId]);
        
        const matchesWithPics = matches.map(user => ({
            ...user,
            picture: user.picture ? `${process.env.API_HOST_URL}:${process.env.API_HOST_PORT}${process.env.PUBLIC_IMAGE_DIR}${user.picture}` : null
        }));

        res.status(200).json({ success: true, matches: matchesWithPics });
    } catch (err) {
        console.error("error getMatches: ", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
};