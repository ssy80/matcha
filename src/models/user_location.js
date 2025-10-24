/*

CREATE TABLE user_locations (
    user_id INTEGER PRIMARY KEY NOT NULL,
    --latitude DECIMAL(10, 8) NOT NULL,  -- e.g., 40.712776
    --longitude DECIMAL(11, 8) NOT NULL, -- e.g., -74.005974
    latitude REAL,                        -- e.g., 40.712776
    longitude REAL,                       -- e.g., -74.005974
    neighborhood VARCHAR(100),            -- Extracted neighborhood name/ suburb 
    city VARCHAR(100),
    country VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);
*/


export class UserLocation {

    constructor(userId, latitude, longitude, neighborhood, city, country, createdAt, updatedAt)
    {
        this._userId = userId;
        this._latitude = latitude;
        this._longitude = longitude;
        this._neighborhood = neighborhood;
        this._city = city;
        this._country = country;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    // Getters
    get userId() {
        return this._userId;
    }

    get latitude() {
        return this._latitude;
    }

    get longitude() {
        return this._longitude;
    }

    get neighborhood() {
        return this._neighborhood;
    }

    get city() {
        return this._city;
    }

    get country() {
        return this._country;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    // Setters
    set userId(value) {
        this._userId = value;
    }

    set latitude(value) {
        this._latitude = value;
    }

    set longitude(value) {
        this._longitude = value;
    }

    set neighborhood(value) {
        this._neighborhood = value;
    }

    set city(value) {
        this._city = value;
    }

    set country(value) {
        this._country = value;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }
}