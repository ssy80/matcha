import { ApiJsonResponse } from '../utils/responseUtil.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import axios from 'axios';
import { UserLocation } from '../models/user_location.js';
import { Validation } from '../utils/validationUtils.js';

dotenv.config();

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

const db = await open({
  filename: '././database/matcha.db',
  driver: sqlite3.Database
});

export async function getMyLocation(req, res){
    try{
        const userId = req.user.id;

        const userLocation = await getUserLocationByUserId(userId);
        //return userLocation;
        const myLocation = {
            "latitude": userLocation.latitude,
            "longitude": userLocation.longitude
        }
        res.status(200).json(ApiJsonResponse([myLocation], null));
    }catch(err){
        console.error("error updateUserLocation: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}

export const updateUserLocation = async(req, res) => {
    try{
        const userId = req.user.id;
        const locationData = req.body;
        let ip = locationData?.ip ?? null;
        let latitude = locationData?.latitude ?? null;
        let longitude = locationData?.longitude ?? null;
        let neighborhood = "unknown";
        let city = "unknown";
        let country = "unknown";

        if (latitude !== null && (typeof latitude !== "number" || !Number.isFinite(latitude))) {
            res.status(400).json(ApiJsonResponse(null, ["invalid latitude"]));
            return;
        }
        if (longitude !== null && (typeof longitude !== "number" || !Number.isFinite(longitude))) {
            res.status(400).json(ApiJsonResponse(null, ["invalid longitude"]));
            return;
        }
        if (ip !== null && (typeof ip !== "string")){
            res.status(400).json(ApiJsonResponse(null, ["invalid ip"]));
            return;
        }
        if (ip){
            ip = ip.trim();
        }

        if (Validation.isValidCoordinates(latitude, longitude)){
            const coordinates = `${latitude}, ${longitude}`;
            const encodedCoordinates = encodeURIComponent(coordinates);
            const geolocateUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodedCoordinates}&key=${OPENCAGE_API_KEY}`;

            let response;
            try {
                response = await axios.get(geolocateUrl);
            } catch (err) {
                console.error("error get OpenCage api: ", err);
                res.status(502).json(ApiJsonResponse(null, ["failed to fetch geolocation data"]));
                return;
            }
            const data = response?.data;
            if (!data){
                res.status(400).json(ApiJsonResponse(null, ["invalid geolocation data"]));
                return;
            }
            neighborhood = data?.results?.[0]?.components?.suburb || data?.result?.[0].components?.neighbourhood || "unknown";
            city = data?.results?.[0]?.components?.city || "unknown";
            country = data?.results?.[0]?.components?.country || "unknown";
        }else if(ip && Validation.isValidIPv4(ip)){
            const iplocateUrl = `https://ipapi.co/${ip}/json/`;

            let response;
            try {
                response = await axios.get(iplocateUrl);
            } catch (err) {
                console.error("error get ipapi api: ", err);
                res.status(502).json(ApiJsonResponse(null, ["failed to fetch ip geolocation data"]));
                return;
            }
            const ipData = response?.data;
            if (!ipData){
                res.status(400).json(ApiJsonResponse(null, ["invalid ip geolocation data"]));
                return;
            }
            const ipCity = ipData?.city || "unknown";
            const ipCountry = ipData?.country_name || "unknown";
            const ipLocation = ipCity + ", " + ipCountry;
            const encodedLocation = encodeURIComponent(ipLocation);
            const geolocateUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + encodedLocation + "&key=" + OPENCAGE_API_KEY;

            let geoResponse;
            try {
                geoResponse = await axios.get(geolocateUrl);
            } catch (err) {
                console.error("error get OpenCage api: ", err);
                res.status(502).json(ApiJsonResponse(null, ["failed to fetch geolocation data"]));
                return;
            }
            const geoData = geoResponse?.data;
            if (!geoData){
                res.status(400).json(ApiJsonResponse(null, ["invalid geolocation data"]));
                return;
            }
            latitude = geoData?.results?.[0]?.geometry?.lat ?? null;
            longitude = geoData?.results?.[0]?.geometry?.lng ?? null;
            neighborhood = geoData?.results?.[0]?.components?.suburb || geoData?.results?.[0]?.components?.neighbourhood|| "unknown";
            city = geoData?.results?.[0]?.components?.city || "unknown";
            country = geoData?.results?.[0]?.components?.country || "unknown";
        }
        else{
            res.status(400).json(ApiJsonResponse(null, ["invalid location data"]));
            return;
        }

        const userLocation = new UserLocation(userId, latitude, longitude, neighborhood, city, country, null, null);
        //console.log(userLocation);
        await updateUserLocationDb(userLocation);
        res.status(200).json(ApiJsonResponse(["success"], null));
    }catch(err){
        console.error("error updateUserLocation: ", err);
        res.status(500).json(ApiJsonResponse(null, ["internal server error"]));
    }
}


async function updateUserLocationDb(userLocation){
    try{
        
        await db.run('UPDATE user_locations SET latitude = ?, longitude = ?, neighborhood = ?, \
            city = ?, country = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?;',
            [userLocation.latitude, userLocation.longitude, userLocation.neighborhood,
                userLocation.city, userLocation.country, userLocation.userId
            ]);

    }catch(err){
        console.error("error updateUserLocationDb: ", err);
        throw (err);
    }
}

//constructor(userId, latitude, longitude, neighborhood, city, country, createdAt, updatedAt)
export async function getUserLocationByUserId(userId)
{
    try{
        const row = await db.get('SELECT * FROM user_locations WHERE user_id = ?', [userId]);

        if (row){
            const userLocation = new UserLocation(row.user_id, row.latitude, row.longitude, row.neighborhood, row.city, row.country, row.created_at, row.updated_at);
            return userLocation;
        }
        else
            return null;
    }
    catch(err){
        console.error("error getUserLocationByUserId: ", err);
        throw err;
    }
}


//
export function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const toRad = deg => deg * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
}