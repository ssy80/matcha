import { db } from '../db/database.js';
import dotenv from 'dotenv';
import axios from 'axios';
import { UserLocation } from '../models/user_location.js';
import { Validation } from '../utils/validationUtils.js';

dotenv.config();

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;


export async function manualUpdateUserLocation(req, res){
    try{
        const userId = req.user.id;
        const manualLocationData = req.body;

        let ip = manualLocationData?.ip ?? null;
        let neighborhood = manualLocationData?.neighborhood ?? "unknown";
        if (ip !== null && (typeof ip !== "string")){
            return res.status(400).json({"success": false, "error": "invalid ip"});
        }
        if(ip === null || !Validation.isValidIPv4(ip.trim())){
            return res.status(400).json({"success": false, "error": "invalid ip"});
        }
        ip = ip.trim();

        if (neighborhood !== null && (typeof neighborhood !== "string") && !Validation.isLengthBetween(neighborhood.trim(), 3, 50)){
            return res.status(400).json({"success": false, "error": "invalid neighborhood"});
        }
        if (neighborhood === "unknown"){
            return res.status(400).json({"success": false, "error": "invalid neighborhood"});
        }
        const ipLocation = await ipToLatLon(ip);
        if (ipLocation === null){
            return res.status(502).json({"success": false, "error": "failed to fetch geolocation data"});
        }
        const { latitude, longitude } = ipLocation;

        const userLocation = new UserLocation(userId, latitude, longitude, neighborhood, "unknown", "unknown", null, null);
        await updateUserLocationDb(userLocation);
        res.status(201).json({"success": true});

    }catch(err){
        console.error("error manualUpdateUserLocation: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}

export async function getMyLocation(req, res){
    try{
        const userId = req.user.id;
        const userLocation = await getUserLocationByUserId(userId);
        const myLocation = {
            "latitude": userLocation.latitude,
            "longitude": userLocation.longitude,
            "neighborhood": userLocation.neighborhood,
            "city": userLocation.city,
            "country": userLocation.country
        }
        res.status(200).json({"success": true, "location": myLocation});
    }catch(err){
        console.error("error getMyLocation: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
    }
}


export const updateUserLocation = async(req, res) => {
    try{
        const userId = req.user.id;
        const locationData = req.body;
        
        let ip = locationData?.ip ?? null;
        let latitude = locationData?.latitude ?? null;
        let longitude = locationData?.longitude ?? null;
        let neighborhood = locationData?.neighborhood ?? "unknown";
        let city = locationData?.city ?? "unknown";
        let country = locationData?.country ?? "unknown";

        if (latitude !== null && (typeof latitude !== "number")) {
            return res.status(400).json({"success": false, "error": "invalid latitude"});
        }
        if (longitude !== null && (typeof longitude !== "number")) {
            return res.status(400).json({"success": false, "error": "invalid longitude"});
        }
        if (ip !== null && (typeof ip !== "string")){
            return res.status(400).json({"success": false, "error": "invalid ip"});
        }
        if (ip){
            ip = ip.trim();
        }

        if (latitude !== null && longitude !== null && Validation.isValidCoordinates(latitude, longitude)){
            
            try {
                const coordinates = `${latitude}, ${longitude}`;
                const encodedCoordinates = encodeURIComponent(coordinates);
                const geolocateUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodedCoordinates}&key=${OPENCAGE_API_KEY}`;

                const response = await axios.get(geolocateUrl);
                const data = response?.data;
                
                if (data && data.results && data.results.length > 0) {
                    const result = data.results[0];
                    neighborhood = result.components?.suburb || result.components?.neighbourhood || neighborhood;
                    city = result.components?.city || result.components?.town || result.components?.village || city;
                    country = result.components?.country || country;
                }
            } catch (err) {
                console.warn("⚠️ OpenCage Geocoding failed. Using manual/fallback location data:", err.message);
            }

        } else if(ip && Validation.isValidIPv4(ip)){
            try {
                const iplocateUrl = `https://ipapi.co/${ip}/json/`;
                const response = await axios.get(iplocateUrl);
                const ipData = response?.data;

                if (!ipData || ipData.error || ipData.reason === "Reserved IP Address"){
                    throw new Error("Invalid IP data");
                }

                const ipCity = ipData.city || "unknown";
                const ipCountry = ipData.country_name || "unknown";
                
                const ipLocation = `${ipCity}, ${ipCountry}`;
                const geolocateUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(ipLocation)}&key=${OPENCAGE_API_KEY}`;
                
                const geoResponse = await axios.get(geolocateUrl);
                const geoData = geoResponse?.data;

                if (geoData && geoData.results && geoData.results.length > 0) {
                    const result = geoData.results[0];
                    latitude = result.geometry?.lat ?? latitude;
                    longitude = result.geometry?.lng ?? longitude;
                    neighborhood = result.components?.suburb || result.components?.neighbourhood || neighborhood;
                    city = result.components?.city || result.components?.town || city;
                    country = result.components?.country || country;
                } else {
                    city = ipCity;
                    country = ipCountry;
                }

            } catch (err) {
                console.error("error during IP geolocation: ", err.message);
                return res.status(502).json({"success": false, "error": "failed to fetch geolocation data"});
            }
        } 
        else {
             return res.status(400).json({"success": false, "error": "invalid location data"});
        }

        if (city === "unknown")
            city = country;
        if (neighborhood === "unknown")
            neighborhood = city;

        const userLocation = new UserLocation(userId, latitude, longitude, neighborhood, city, country, null, null);
        await updateUserLocationDb(userLocation);
        res.status(201).json({"success": true});

    }catch(err){
        console.error("error updateUserLocation: ", err);
        res.status(500).json({"success": false, "error": "internal server error"});
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


export function getDistanceKm(lat1, lon1, lat2, lon2) {
    try{
        const R = 6371;
        const toRad = deg => deg * Math.PI / 180;

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }catch(err){
        console.error("error getDistanceKm: ", err);
        throw err;
    }
}

async function ipToLatLon(ip){
    try {
        const iplocateUrl = `https://ipapi.co/${ip}/json/`;
        const response = await axios.get(iplocateUrl);
        const ipData = response?.data;

        if (!ipData || ipData.error || ipData.reason === "Reserved IP Address"){
            throw new Error("Invalid IP data");
        }

        let latitude = null;
        let longitude = null;

        console.log("IP data:", ipData);

        if (ipData.latitude && ipData.longitude) {
            latitude = parseFloat(ipData.latitude);
            longitude = parseFloat(ipData.longitude);
            return { latitude, longitude };
        } else{
            return null;
        }
        

    } catch (err) {
        console.error("error during IP geolocation: ", err.message);
        return null;
    }
}