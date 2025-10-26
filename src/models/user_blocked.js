/*

CREATE TABLE user_blockeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    blocked_user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION,
    FOREIGN KEY (blocked_user_id) REFERENCES users(id)
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);
*/

export class UserBlocked {

    constructor(id, userId, blockedUserId, createdAt, updatedAt)
    {
        this._id = id;
        this._userId = userId;
        this._blockedUserId = blockedUserId;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    // ID getter/setter
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    // User ID getter/setter
    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    // Blocked User ID getter/setter
    get blockedUserId() {
        return this._blockedUserId;
    }

    set blockedUserId(value) {
        this._blockedUserId = value;
    }

    // Created At getter/setter
    get createdAt() {
        return this._createdAt;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    // Updated At getter/setter
    get updatedAt() {
        return this._updatedAt;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }
}