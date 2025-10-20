/*
CREATE TABLE user_profiles (
    user_id INTEGER NOT NULL,
    gender VARCHAR(20) NOT NULL,
    biography VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);
*/


export class UserProfile {

    constructor(userId, gender, biography, createdAt, updatedAt) 
    {
        this._userId = userId;
        this._gender = gender;
        this._biography = biography;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    // Getters
    get userId() {
        return this._userId;
    }

    get gender() {
        return this._gender;
    }

    get biography() {
        return this._biography;
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

    set gender(value) {
        this._gender = value;
    }

    set biography(value) {
        this._biography = value;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }

}