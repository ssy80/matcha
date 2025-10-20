/*
CREATE TABLE user_sexual_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    preference VARCHAR(100) NOT NULL,
    UNIQUE (user_id, preference),
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);
*/

export class UserSexualPreference {

    constructor(id, userId, preference, createdAt, updatedAt)
    {
        this._id = id;
        this._userId = userId;
        this._preference = preference;
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

    get preference() {
        return this._preference;
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

    set preference(value) {
        this._preference = value;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }
}