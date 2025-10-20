/*
CREATE TABLE user_pictures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    picture VARCHAR(200) NOT NULL,
    is_profile_picture INTEGER DEFAULT 0,
    UNIQUE (user_id, picture),
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);
*/


export class UserPicture {

    constructor(id, userId, picture, isProfilePicture, createdAt, updatedAt)
    {
        this._id = id;
        this._userId = userId;
        this._picture = picture;
        this._isProfilePicture = isProfilePicture;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    // Getters
    get id() {
        return this._id;
    }

    get userId() {
        return this._userId;
    }

    get picture() {
        return this._picture;
    }

    get isProfilePicture() {
        return this._isProfilePicture;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    // Setters
    set id(value) {
        this._id = value;
    }

    set userId(value) {
        this._userId = value;
    }

    set picture(value) {
        this._picture = value;
    }

    set isProfilePicture(value) {
        this._isProfilePicture = value;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }
}