import { db } from '../db/database.js';
import { Validation } from '../utils/validationUtils.js';
import dotenv from 'dotenv';
import { getUserById} from './userDbService.js';
import { getUserLocationByUserId } from '../services/locationService.js';
import { getTotalUsers, getStars, getUserBlocked } from '../services/profileService.js';


dotenv.config();

const IMAGE_URL = `${process.env.API_HOST_URL}:${process.env.API_HOST_PORT}${process.env.PUBLIC_IMAGE_DIR}`;
const suggestedProfileDistKm = Number(process.env.SUGGESTED_PROFILE_DIST_KM);

const intersect = (a, b) => new Set([...a].filter(x => b.has(x)));

export const searchProfiles = async (req, res) =>{
    try{
        const userId = req.user.id;
        const searchData = req.body;
        let min_dist_km = searchData?.min_dist_km ?? null;
        let max_dist_km = searchData?.max_dist_km ?? null;
        let min_age = searchData?.min_age ?? null;
        let max_age = searchData?.max_age ?? null;
        let interests = searchData?.interests ?? null;
        let min_stars = searchData?.min_stars ?? null;
        let max_stars = searchData?.max_stars ?? null;
        
        if (min_dist_km != null && typeof min_dist_km !== "number") {
            res.status(400).json({"success": false, "error": "invalid min_dist_km"});
            return;
        }
        if (max_dist_km != null && typeof max_dist_km !== "number") {
            res.status(400).json({"success": false, "error": "invalid max_dist_km"});
            return;
        }
        if ((min_dist_km != null && max_dist_km === null) || (min_dist_km === null && max_dist_km != null)) {
            res.status(400).json({"success": false, "error": "invalid min_dist_km or max_dist_km"});
            return;
        }
        if (min_age != null && typeof min_age !== "number") {
            res.status(400).json({"success": false, "error": "invalid min_age"});
            return;
        }
        if (max_age != null && typeof max_age !== "number") {
            res.status(400).json({"success": false, "error": "invalid max_age"});
            return;
        }
        if ((min_age != null && max_age === null) || (min_age === null && max_age != null)) {
            res.status(400).json({"success": false, "error": "invalid min_age or max_age"});
            return;
        }        
        if (interests != null && !Validation.isValidInterests(interests)){
            res.status(400).json({"success": false, "error": "invalid interests"});
            return;
        }
        if (min_stars != null && (typeof min_stars !== "number" || !Number.isInteger(min_stars))) {
            res.status(400).json({"success": false, "error": "invalid min_stars"});
            return;
        }
        if (min_stars != null && (min_stars < 0 || min_stars > 5)) {
            res.status(400).json({"success": false, "error": "min_stars must be between 0 and 5"});
            return;
        }
        if (max_stars != null && (typeof max_stars !== "number" || !Number.isInteger(max_stars))) {
            res.status(400).json({"success": false, "error": "invalid max_stars"});
            return;
        }
        if (max_stars != null && (max_stars < 0 || max_stars > 5)) {
            res.status(400).json({"success": false, "error": "max_stars must be between 0 and 5"});
            return;
        }
        if ((min_stars != null && max_stars === null) || (min_stars === null && max_stars != null)) {
            res.status(400).json({"success": false, "error": "invalid min_stars or max_stars"});
            return;
        }

        if ((min_dist_km === null && max_dist_km === null) &&
            (min_age === null && max_age === null) &&
            interests === null &&
            min_stars === null && max_stars === null) {
            res.status(400).json({"success": false, "error": "at least one search criteria"});
            return;
        }
        
        const user = await getUserById(userId);
        const userLocation = await getUserLocationByUserId(userId);
        if(typeof userLocation.latitude !== "number" || typeof userLocation.longitude !== "number"){
            res.status(409).json({"success": false, "error": "invalid user location"});
            return;
        }

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
        if (min_stars !== null){
            const totalUsers = await getTotalUsers();
            const fifth = Math.ceil(totalUsers / 5);
            if (min_stars === 0){
                criteria.min_liked_count = 0;      
            }else{
                const count = fifth * min_stars;
                criteria.min_liked_count = count - fifth + 1;
            }
            if (max_stars === 0){
                criteria.max_liked_count = 0;         
            }else{
                const count = fifth * max_stars;
                criteria.max_liked_count = count;
            }
        }

        let distSet = null;
        let ageSet = null;
        let interestSet = null;
        let likedSet = null;

        if (criteria.min_dist_km !== undefined){
            const usersByDist = await getUsersByDist(user, userLocation, criteria);
            distSet = new Set(usersByDist.map(u => u.id));
        }
        if (criteria.min_age !== undefined){
            const usersByAge = await getUsersByAge(user, userLocation, criteria);
            ageSet = new Set(usersByAge.map(u => u.id));
        }
        if (criteria.interests !== undefined){
            const interestUsers = await getUsersByInterests(user, userLocation, criteria);
            interestSet = new Set(interestUsers.map(u => u.user_id));
        }
        if (criteria.min_liked_count !== undefined){
            const likedUsers = await getUsersByFameRating(user, userLocation, criteria);
            likedSet = new Set(likedUsers.map(u => u.user_id));
        }

        let intersectedSet = null;

        for (const set of [distSet, ageSet, interestSet, likedSet]) {
            if (!set) continue;
            if (!intersectedSet) {
                intersectedSet = new Set(set);
            } else {
                intersectedSet = new Set([...intersectedSet].filter(x => set.has(x)));
            }
        }

        //get user details, location, liked,
        let searchProfiles = [];
        for(const intersectUserId of intersectedSet){
            const userBlocked = await getUserBlocked(userId, intersectUserId);  //prevent blocked user from showing in search results
            if (userBlocked)
                continue;
            const profile = await getSearchProfileUser(intersectUserId, userLocation); 
            searchProfiles.push(profile);
        }
        
        const totalUsers = await getTotalUsers();

        searchProfiles.forEach(profile => {
            profile.distance_km = parseFloat(profile.distance_km.toFixed(2));
            profile.interests = profile.interests.split(',');
            const stars = getStars(totalUsers, profile.liked_count);
            profile.fame_rating = {"stars": stars, "liked_count": profile.liked_count};
            if (profile.profile_picture){
                profile.profile_picture = `${IMAGE_URL}${profile.profile_picture}`;
            }
        });
        res.status(200).json({"success": true, "profiles": searchProfiles});
    }catch(err){
        console.error("error searchProfiles: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


export const getSuggestedProfiles = async (req, res) =>{
    try{
        const userId = req.user.id;
        const user = await getUserById(userId);
        const userLocation = await getUserLocationByUserId(userId);
        if (userLocation.latitude == null || typeof userLocation.latitude !== "number" || userLocation.longitude == null || typeof userLocation.longitude !== "number") {
            res.status(409).json({"success": false, "error": "invalid user location"});
            return;
        }

        // Debug checker
        console.log("DEBUG VALUES:", {
            userId: user.id,
            gender: user.gender,
            pref: user.sexualPreference,
            distLimit: suggestedProfileDistKm
        });

        let suggestedProfiles = await getSuggestedProfilesDb(user, userLocation, suggestedProfileDistKm);

        const totalUsers = await getTotalUsers();

        suggestedProfiles.forEach(profile => {
            profile.distance_km = parseFloat(profile.distance_km.toFixed(2));
            profile.interests = profile.interests.split(',');
            const stars = getStars(totalUsers, profile.liked_count);
            profile.fame_rating = {"stars":stars, "liked_count": profile.liked_count};
            if (profile.profile_picture){
                profile.profile_picture = `${IMAGE_URL}${profile.profile_picture}`;
            }
        });

        suggestedProfiles.sort((a, b) => 
            a.distance_km - b.distance_km || 
            b.num_shared_interest - a.num_shared_interest || 
            b.fame_rating.stars - a.fame_rating.stars
        );
        res.status(200).json({"success": true, "profiles": suggestedProfiles});
    }catch(err){
        console.error("error getSuggestedProfiles: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


async function getSuggestedProfilesDb(user, userLocation, dist){
    try{
        const sql = `
            WITH current_user_interests AS (
                SELECT interest
                FROM user_interests
                WHERE user_id = ?
            ),
            nearby_users AS (
                SELECT 
                l.user_id,
                u.username,
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
                AND (
                    u.sexual_preference = ? OR u.sexual_preference = 'bi-sexual'
                )
                AND (
                    ? = 'bi-sexual' OR u.gender = ?
                )
                
            )

            SELECT 
                n.user_id,
                n.username,
                n.gender,
                (strftime('%Y', 'now') - strftime('%Y', n.date_of_birth)) -
                    (strftime('%m-%d', 'now') < strftime('%m-%d', n.date_of_birth)) AS age,
                n.sexual_preference,
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
            AND NOT EXISTS (
                SELECT 1 
                FROM user_blockeds ub
                WHERE ub.user_id = ? 
                AND ub.blocked_user_id = n.user_id
            )
            GROUP BY n.user_id
            ORDER BY 
                n.distance_km ASC, 
                num_shared_interest DESC,
                liked_count DESC;
            `;

        const rows = await db.all(sql, 
            [user.id, 
                userLocation.latitude, 
                userLocation.longitude, 
                userLocation.latitude, 
                user.id, 
                user.gender, 
                user.sexualPreference, 
                user.sexualPreference === 'bi-sexual' ? user.gender : user.sexualPreference, 
                dist, 
                user.id]
            );
        return rows;
    }catch(err){
        console.error("error getSuggestedProfilesDb: ", err);
        throw err;
    }
}


async function getUsersByDist(user, userLocation, criteria){
    try{
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
            AND (
                u.sexual_preference = ? OR u.sexual_preference = 'bi-sexual'
            )
            AND (
                ? = 'bi-sexual' OR u.gender = ?
            )
        ;`;
        
        const distUsers = await db.all(distQuery, 
            [
                userLocation.latitude,
                userLocation.longitude,
                userLocation.latitude,
                criteria.min_dist_km,
                criteria.max_dist_km,
                user.id,
                user.gender,
                user.sexualPreference,
                user.sexualPreference === 'bi-sexual' ? user.gender : user.sexualPreference
            ]);
        return distUsers;
    }catch(err){
        console.error("error getUsersByDist: ", err);
        throw err;
    }
}


async function getUsersByAge(user, userLocation, criteria){
    try{
        const ageQuery = `
            SELECT id
            FROM users u
            WHERE (
            (strftime('%Y', 'now') - strftime('%Y', date_of_birth)) -
            (strftime('%m-%d', 'now') < strftime('%m-%d', date_of_birth))
            ) BETWEEN ? AND ?
            AND
            u.user_status = 'activated'
            AND u.id != ?
            AND (
                u.sexual_preference = ? OR u.sexual_preference = 'bi-sexual'
            )
            AND (
                ? = 'bi-sexual' OR u.gender = ?
            )
        ;`;
        const ageUsers = await db.all(ageQuery, 
            [
                criteria.min_age,
                criteria.max_age,
                user.id,
                user.gender,
                user.sexualPreference,
                user.sexualPreference === 'bi-sexual' ? user.gender : user.sexualPreference
            ]);
        return ageUsers;
    }catch(err){
        console.error("error getUsersByAge: ", err);
        throw err;
    }
}


async function getUsersByInterests(user, userLocation, criteria){
    try{
        const interestQuery = `
            SELECT ui.user_id
            FROM user_interests ui
            INNER JOIN users u ON u.id = ui.user_id 
            WHERE interest IN (${criteria.interests.map(() => '?').join(', ')}) 
            AND
            u.user_status = 'activated'
            AND u.id != ?
            AND (
                u.sexual_preference = ? OR u.sexual_preference = 'bi-sexual'
            )
            AND (
                ? = 'bi-sexual' OR u.gender = ?
            )
            GROUP BY ui.user_id
            HAVING COUNT(DISTINCT interest) = ?
            ;`;
 
        const interestUsers = await db.all(interestQuery,
            [
                ...criteria.interests,
                user.id,
                user.gender,
                user.sexualPreference,
                user.sexualPreference === 'bi-sexual' ? user.gender : user.sexualPreference,
                criteria.interests.length
            ]);
        return interestUsers;
    }catch(err){
        console.error("error getUsersByInterests: ", err);
        throw err;
    }
}


async function getUsersByFameRating(user, userLocation, criteria){
    try{
        const likedQuery = `
            SELECT fr.user_id
            FROM fame_ratings fr
            INNER JOIN users u ON u.id = fr.user_id
            WHERE liked_count BETWEEN ? AND ?
            AND 
            u.user_status = 'activated'
            AND u.id != ?
            AND (
                u.sexual_preference = ? OR u.sexual_preference = 'bi-sexual'
            )
            AND (
                ? = 'bi-sexual' OR u.gender = ?
            )
        ;`;
        
        const likedUsers = await db.all(likedQuery,
            [
                criteria.min_liked_count,
                criteria.max_liked_count,
                user.id,
                user.gender,
                user.sexualPreference,
                user.sexualPreference === 'bi-sexual' ? user.gender : user.sexualPreference
            ]);
        return likedUsers;
    }catch(err){
        console.error("error getUsersByFameRating: ", err);
        throw err;
    }
}


async function getSearchProfileUser(user_id, userLocation){
    try{
        const profileQuery = `
            SELECT u.id, 
            u.username,
            u.gender, 
            u.sexual_preference,
            (strftime('%Y', 'now') - strftime('%Y', u.date_of_birth)) -
                    (strftime('%m-%d', 'now') < strftime('%m-%d', u.date_of_birth)) AS age,
            (
                6371 * acos(
                cos(radians(?)) * cos(radians(l.latitude)) *
                cos(radians(l.longitude) - radians(?)) +
                sin(radians(?)) * sin(radians(l.latitude))
                )
            ) AS distance_km,
            (
                SELECT GROUP_CONCAT(ui.interest)
                FROM user_interests ui
                WHERE ui.user_id = u.id
            ) AS interests,
            (
                SELECT picture
                FROM user_pictures up
                WHERE up.user_id = u.id AND is_profile_picture = 1
                LIMIT 1
            ) AS profile_picture,
            (
                SELECT fr.liked_count 
                FROM fame_ratings fr 
                WHERE fr.user_id = u.id 
            ) AS liked_count
            FROM users u
            JOIN user_locations l ON l.user_id = u.id
            WHERE u.id = ?
        ;`;

        const profile = await db.get(profileQuery, [userLocation.latitude, userLocation.longitude, userLocation.latitude, user_id]);
        return profile;
    }catch(err){
        console.error("error getSearchProfileUser: ", err);
        throw err;
    }
}
