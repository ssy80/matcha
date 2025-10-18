
/*
CREATE TABLE user_activation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activation_uuid VARCHAR(100) NOT NULL UNIQUE,
    activation_status VARCHAR(50) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
*/

export class UserActivation {

    constructor(id, activation_uuid, activation_status, user_id, createdAt, updatedAt) 
    {
        this._id = id;
        this._activation_uuid = activation_uuid;
        this._activation_status = activation_status;
        this._user_id = user_id;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    // Getters
    get id() {
        return this._id;
    }

    get activation_uuid() {
        return this._activation_uuid;
    }

    get activation_status() {
        return this._activation_status;
    }

    get user_id() {
        return this._user_id;
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

    set activation_uuid(value) {
        this._activation_uuid = value;
    }

    set activation_status(value) {
        this._activation_status = value;
    }

    set user_id(value) {
        this._user_id = value;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }

}