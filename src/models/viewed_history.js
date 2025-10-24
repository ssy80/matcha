

/*
CREATE TABLE viewed_histories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    viewed_user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
    FOREIGN KEY (viewed_user_id) REFERENCES users(id)
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);
*/

export class ViewedHistory {

    constructor(id, userId, viewedUserId, createdAt, updatedAt)
    {
        this._id = id;
        this._userId = userId;
        this._viewedUserId = viewedUserId;
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

    get viewedUserId() {
        return this._viewedUserId;
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

    set viewedUserId(value) {
        this._viewedUserId = value;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }
}