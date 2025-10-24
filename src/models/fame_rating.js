/*
CREATE TABLE fame_ratings (
    user_id INTEGER NOT NULL,
    liked_count INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);
*/


export class FameRating {

    constructor(userId, likedCount, createdAt, updatedAt)
    {
        this._userId = userId;
        this._likedCount = likedCount;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    // Getters

    get userId() {
        return this._userId;
    }

    get likedCount() {
        return this._likedCount;
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

    set likedCount(value) {
        this._likedCount = value;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }
}