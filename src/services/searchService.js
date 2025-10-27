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
import { getUserInterestsByUserId} from '../services/profileService.js';
import { getTotalUsers, getStars } from '../services/profileService.js';

dotenv.config();

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)

const db = await open({
  filename: '././database/matcha.db',
  driver: sqlite3.Database
});

/*
{
    "min_dist_km": 0,
    "max_dist_km": 10,
    "min_age": 25,
    "max_age": 45,
    "interests": ["#jog","#movie"],
    "fame_stars": 4 
}
*/
export const searchProfiles = async (req, res) =>{
    try{
        const userId = req.user.id;
        const searchData = req.body;
        let min_dist_km = searchData?.min_dist_km ?? null;
        let max_dist_km = searchData?.max_dist_km ?? null;
        let min_age = searchData?.min_age ?? null;
        let max_age = searchData?.max_age ?? null;
        let interests = searchData?.interests ?? null;
        let fame_stars = searchData?.fame_stars ?? null;
        if (min_dist_km != null && typeof min_dist_km !== "number") {
            res.status(400).json(ApiJsonResponse(null, ["invalid min_dist_km"]));
            return;
        }
        if (max_dist_km != null && typeof max_dist_km !== "number") {
            res.status(400).json(ApiJsonResponse(null, ["invalid max_dist_km"]));
            return;
        }
        if ((min_dist_km != null && max_dist_km === null) || (min_dist_km === null && max_dist_km != null)) {
            res.status(400).json(ApiJsonResponse(null, ["invalid min_dist_km or max_dist_km"]));
            return;
        }
        if (min_age != null && typeof min_age !== "number") {
            res.status(400).json(ApiJsonResponse(null, ["invalid min_age"]));
            return;
        }
        if (max_age != null && typeof max_age !== "number") {
            res.status(400).json(ApiJsonResponse(null, ["invalid max_age"]));
            return;
        }
        if ((min_age != null && max_age === null) || (min_age === null && max_age != null)) {
            res.status(400).json(ApiJsonResponse(null, ["invalid min_age or max_age"]));
            return;
        }
        if (interests && !Validation.isValidInterests(interests)){
            res.status(400).json(ApiJsonResponse(null, ["invalid interests"]));
            return;
        }
        if (fame_stars != null && (typeof fame_stars !== "number" || !Number.isInteger(fame_stars))) {
            res.status(400).json(ApiJsonResponse(null, ["invalid fame_stars"]));
            return;
        }
        if (fame_stars != null && (fame_stars < 0 || fame_stars > 5)) {
            res.status(400).json(ApiJsonResponse(null, ["fame_stars must be between 0 and 5"]));
            return;
        }
        if ((min_dist_km === null && max_dist_km === null) &&
            (min_age === null && max_age === null) &&
            interests === null &&
            fame_stars === null) {
            res.status(400).json(ApiJsonResponse(null, ["at least one search criteria"]));
            return;
        }
        
        const user = await getUserById(userId);
        const userLocation = await getUserLocationByUserId(userId);
        if(typeof userLocation.latitude !== "number"|| typeof userLocation.longitude !== "number"){
            res.status(400).json(ApiJsonResponse(null, ["invalid user location"]));
            return;
        }

        /*interests = ["#movie", "#jog"]
        min_liked_count = 300;         
        min_dist_km = 0;
        max_dist_km = 10;
        min_age = 18;
        max_age = 30;*/
        const criteria = {};
        if (min_dist_km !== null && max_dist_km !== null){
            criteria.min_dist_km = min_dist_km;
            criteria.max_dist_km = max_dist_km;
        }
        if (min_age !== null && max_age !== null){
            criteria.min_age = min_age;
            criteria.max_age = max_age;
        }
        if (interests !== null){
            criteria.interests = interests;
        }
        if (fame_stars !== null){
            const totalUsers = await getTotalUsers();
            const fifth = Math.ceil(totalUsers / 5);
            if (fame_stars === 0){
                criteria.min_liked_count = 0;
                criteria.max_liked_count = 0;         
            }else{
                const count = fifth * fame_stars;
                criteria.min_liked_count = count - fifth + 1;
                criteria.max_liked_count = count;
            }
        }

        //let searchProfiles = await searchProfilesDb(user, userLocation, criteria);

        const usersByDist = await getUsersByDist(user, userLocation, criteria);
        console.log(usersByDist);

        /*let suggestedProfiles = await searchProfilesDb(user, userLocation, 10);

        const totalUsers = await getTotalUsers();

        suggestedProfiles.forEach(profile => {
            profile.distance_km = parseFloat(profile.distance_km.toFixed(2));
            profile.interests = profile.interests.split(',');
            const stars = getStars(totalUsers, profile.liked_count);
            profile.fame_rating = {"stars":stars, "liked_count": profile.liked_count};
        });

        suggestedProfiles.sort((a, b) => 
            a.distance_km - b.distance_km || 
            b.num_shared_interest - a.num_shared_interest || 
            b.fame_rating.stars - a.fame_rating.stars
        );

        console.log(suggestedProfiles);
        console.log(suggestedProfiles.length);*/

        res.status(200).json(ApiJsonResponse(["success"], null));
    }catch(err){
        console.error("error searchProfiles: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}


export const getSuggestedProfiles = async (req, res) =>{
    try{
        const userId = req.user.id;

        const user = await getUserById(userId);
        const userLocation = await getUserLocationByUserId(userId);
        if(Number.isNaN(userLocation.latitude) || Number.isNaN(userLocation.longitude)){
            res.status(400).json(ApiJsonResponse(null, ["invalid user location"]));
            return;
        }
           
        let suggestedProfiles = await getSuggestedProfilesDb(user, userLocation, 10); //within 10km

        const totalUsers = await getTotalUsers();

        suggestedProfiles.forEach(profile => {
            profile.distance_km = parseFloat(profile.distance_km.toFixed(2));
            profile.interests = profile.interests.split(',');
            const stars = getStars(totalUsers, profile.liked_count);
            profile.fame_rating = {"stars":stars, "liked_count": profile.liked_count};
        });

        suggestedProfiles.sort((a, b) => 
            a.distance_km - b.distance_km || 
            b.num_shared_interest - a.num_shared_interest || 
            b.fame_rating.stars - a.fame_rating.stars
        );

        console.log(suggestedProfiles);
        console.log(suggestedProfiles.length);

        res.status(200).json(ApiJsonResponse([suggestedProfiles], null));
    }catch(err){
        console.error("error getSuggestedProfiles: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}

/*
const interests = ['#jog', '#movie'];
const sql = `
  SELECT user_id
  FROM user_interests
  WHERE interest IN (${interests.map(() => '?').join(', ')})
  GROUP BY user_id
  HAVING COUNT(DISTINCT interest) = ${interests.length};
`;
*/
async function getSuggestedProfilesDb(user, userLocation, dist){
    try{
        const pref = getComplementarySexualPreference(user.sexualPreference);

        const sql = `
            WITH current_user_interests AS (
                SELECT interest
                FROM user_interests
                WHERE user_id = ?
            ),
            nearby_users AS (
                SELECT 
                l.user_id,
                u.gender,
                u.date_of_birth,
                u.sexual_preference,
                l.latitude,
                l.longitude,
                l.neighborhood,
                l.city,
                l.country,
                (
                    6371 * acos(
                    cos(radians(?)) * cos(radians(l.latitude)) *
                    cos(radians(l.longitude) - radians(?)) +
                    sin(radians(?)) * sin(radians(l.latitude))
                    )
                ) AS distance_km
                FROM user_locations l
                JOIN users u ON u.id = l.user_id
                WHERE 
                u.user_status = 'activated'
                AND u.id != ?
                AND u.sexual_preference = ?
            )

            SELECT 
                n.user_id,
                n.gender,
                (strftime('%Y', 'now') - strftime('%Y', n.date_of_birth)) -
                    (strftime('%m-%d', 'now') < strftime('%m-%d', n.date_of_birth)) AS age,
                n.sexual_preference,
                n.latitude,
                n.longitude,
                n.neighborhood,
                n.city,
                n.country,
                n.distance_km,

                (
                    SELECT GROUP_CONCAT(ui_all.interest)
                    FROM user_interests ui_all
                    WHERE ui_all.user_id = n.user_id
                ) AS interests,

                (
                    SELECT COUNT(*)
                    FROM user_interests
                    WHERE user_id = n.user_id
                    AND interest IN (SELECT interest FROM current_user_interests)
                ) AS num_shared_interest,

                fr.liked_count AS liked_count,

                (
                    SELECT picture
                    FROM user_pictures
                    WHERE user_id = n.user_id AND is_profile_picture = 1
                    LIMIT 1
                ) AS profile_picture
                
            FROM nearby_users n
            JOIN users u ON u.id = n.user_id

            LEFT JOIN fame_ratings fr
                ON fr.user_id = n.user_id
            WHERE n.distance_km <= ?
            AND EXISTS (
                SELECT 1
                FROM user_pictures p
                WHERE p.user_id = n.user_id AND p.is_profile_picture = 1
            )
            GROUP BY n.user_id
            ORDER BY 
                n.distance_km ASC, 
                num_shared_interest DESC,
                liked_count DESC;
            `;

        const rows = await db.all(sql, [user.id, userLocation.latitude, userLocation.longitude, userLocation.latitude, user.id, pref, dist]);
        return rows;
    }catch(err){
        console.error("error getSuggestedProfilesDb: ", err);
        throw err;
    }
}

function getComplementarySexualPreference(sexualPreference) {
  switch (sexualPreference) {
    case "male":
        return "female";
    case "female":
        return "male";
    case "bi-sexual":
        return "bi-sexual";
    default:
        return sexualPreference;
  }
}


/*function insertFameRating(suggestedProfiles, totalUsers){
    try{
        for (const profile of suggestedProfiles){
            const stars = getStars(totalUsers, profile.liked_count);
            profile.fame_rating = {"stars":stars, "liked_count": profile.liked_count};
        }
        //return suggestedProfiles;
    }catch(err){
        console.error("error insertFameRating: ", err);
        throw err;
    }
}*/
/*async function getTotalLikedCount(){
    try{
        const row = await db.get('SELECT sum(liked_count) as total from fame_ratings;');
        let total = 0;
        if (!row)
            total = row.total;
        return total;
    }catch(err){
        console.error("error getTotalLikedCount: ", err);
        throw err;
    }
}*/

async function getUsersByDist(user, userLocation, criteria){
    try{
        const pref = getComplementarySexualPreference(user.sexualPreference);
        // 1️⃣ Get users by distance
        const distQuery = `
            SELECT u.id
            FROM users u
            JOIN user_locations l ON u.id = l.user_id
            WHERE (
            6371 * acos(
                cos(radians(?)) * cos(radians(l.latitude)) *
                cos(radians(l.longitude) - radians(?)) +
                sin(radians(?)) * sin(radians(l.latitude))
            )
            ) BETWEEN ? AND ?
            AND
            u.user_status = 'activated'
            AND u.id != ?
            AND u.sexual_preference = ?
        ;`
        const distUsers = await db.all(distQuery, [userLocation.latitude, userLocation.longitude, userLocation.latitude,
            criteria.min_dist_km, criteria.max_dist_km, user.id, pref]);
        return distUsers;
        
    }catch(err){
        console.error("error getUsersByDist: ", err);
        throw err;
    }
}

async function getUsersByCriteria(user, location, criteria) {
    const { latitude, longitude } = location;

    // 1️⃣ Get users by distance
    const distQuery = `
        SELECT u.id
        FROM users u
        JOIN user_locations l ON u.id = l.user_id
        WHERE (
        6371 * acos(
            cos(radians(?)) * cos(radians(l.latitude)) *
            cos(radians(l.longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(l.latitude))
        )
        ) BETWEEN ? AND ?
    `;
    const distUsers = await db.all(distQuery, [
        latitude, longitude, latitude, criteria.min_dist_km, criteria.max_dist_km
    ]);
    const distSet = new Set(distUsers.map(u => u.id));

    // 2️⃣ Get users by age
    const ageQuery = `
        SELECT id
        FROM users
        WHERE (
        (strftime('%Y', 'now') - strftime('%Y', date_of_birth)) -
        (strftime('%m-%d', 'now') < strftime('%m-%d', date_of_birth))
        ) BETWEEN ? AND ?
    `;
    const ageUsers = await db.all(ageQuery, [criteria.min_age, criteria.max_age]);
    const ageSet = new Set(ageUsers.map(u => u.id));

    // 3️⃣ Get users by interests
    let interestSet = new Set();
    if (criteria.interests?.length) {
        const interestQuery = `
        SELECT DISTINCT user_id
        FROM user_interests
        WHERE interest IN (${criteria.interests.map(() => '?').join(', ')})
        `;
        const interestUsers = await db.all(interestQuery, criteria.interests);
        interestSet = new Set(interestUsers.map(u => u.user_id));
    }

    // 4️⃣ Get users by liked_count
    const likedQuery = `
        SELECT user_id
        FROM fame_ratings
        WHERE liked_count BETWEEN ? AND ?
    `;
    const likedUsers = await db.all(likedQuery, [
        criteria.min_liked_count || 0,
        criteria.max_liked_count || 999999
    ]);
    const likedSet = new Set(likedUsers.map(u => u.user_id));

    // 5️⃣ Intersection of all sets
    const intersect = (a, b) => new Set([...a].filter(x => b.has(x)));
    let finalSet = intersect(distSet, ageSet);
    if (criteria.interests?.length) finalSet = intersect(finalSet, interestSet);
    finalSet = intersect(finalSet, likedSet);

    // 6️⃣ Return final user details
    const ids = [...finalSet];
    if (ids.length === 0) return [];

    const resultQuery = `
        SELECT u.*, fr.liked_count
        FROM users u
        LEFT JOIN fame_ratings fr ON u.id = fr.user_id
        WHERE u.id IN (${ids.map(() => '?').join(', ')})
    `;
    const finalUsers = await db.all(resultQuery, ids);
    return finalUsers;
}


async function searchProfilesDb(user, userLocation, criteria){
    try{
        const pref = getComplementarySexualPreference(user.sexualPreference);

        let params = [userLocation.latitude, userLocation.longitude];

        const sql = `
        
            WITH current_user AS (
                SELECT ? AS current_lat, ? AS current_lon
            )

            -- 1️⃣ Distance filter
            SELECT u.id AS user_id
            FROM users u
            JOIN user_locations l ON u.id = l.user_id, current_user c
            WHERE 
                u.user_status = 'activated'
                AND (
                    6371 * acos(
                        cos(radians(c.current_lat)) * cos(radians(l.latitude)) *
                        cos(radians(l.longitude) - radians(c.current_lon)) +
                        sin(radians(c.current_lat)) * sin(radians(l.latitude))
                    )
                ) BETWEEN ? AND ?  -- min_dist_km, max_dist_km

            INTERSECT

            -- 2️⃣ Age filter
            SELECT id AS user_id
            FROM users
            WHERE (
                (strftime('%Y', 'now') - strftime('%Y', date_of_birth)) -
                (strftime('%m-%d', 'now') < strftime('%m-%d', date_of_birth))
            ) BETWEEN ? AND ?  -- min_age, max_age

            INTERSECT

            -- 3️⃣ Interests filter (strict AND)
            SELECT user_id
            FROM user_interests
            WHERE interest IN (${interests.map(() => '?').join(', ')})
            GROUP BY user_id
            HAVING COUNT(DISTINCT interest) = ${interests.length}


            INTERSECT

            -- 4️⃣ Fame rating filter
            SELECT user_id
            FROM fame_ratings
            WHERE liked_count >= ?

            INTERSECT

            -- 5️⃣ Must have profile picture
            SELECT user_id
            FROM user_pictures
            WHERE is_profile_picture = 1;

        `;

        //const rows = await db.all(sql, [user.id, userLocation.latitude, userLocation.longitude, userLocation.latitude, user.id, pref, dist]);
        return rows;
    }catch(err){
        console.error("error getSuggestedProfilesDb: ", err);
        throw err;
    }
}