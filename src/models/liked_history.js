

/*
CREATE TABLE liked_histories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    liked_user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION,
    FOREIGN KEY (liked_user_id) REFERENCES users(id)
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);
*/


export class LikedHistory {

    constructor(id, userId, likedUserId, createdAt, updatedAt)
    {
        this._id = id;
        this._userId = userId;
        this._likedUserId = likedUserId;
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

    get likedUserId() {
        return this._likedUserId;
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

    set likedUserId(value) {
        this._likedUserId = value;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }
}