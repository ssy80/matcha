/**
 * CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    from_user_id INTEGER NOT NULL,
    event_type varchar(30) NOT NULL,    -- liked_me, viewed_me, new_message, connected, disconnect
    event_status varchar(30) NOT NULL,  -- new, notified
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);
 */

export class Event {

    constructor(id, userId, fromUserId, eventType, eventStatus, createdAt, updatedAt)
    {
        this._id = id;
        this._userId = userId;
        this._fromUserId = fromUserId;
        this._eventType = eventType;
        this._eventStatus = eventStatus;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    // id getter/setter
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    // userId getter/setter
    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    // fromUserId getter/setter
    get fromUserId() {
        return this._fromUserId;
    }

    set fromUserId(value) {
        this._fromUserId = value;
    }

    // eventType getter/setter
    get eventType() {
        return this._eventType;
    }

    set eventType(value) {
        this._eventType = value;
    }

    // eventStatus getter/setter
    get eventStatus() {
        return this._eventStatus;
    }

    set eventStatus(value) {
        this._eventStatus = value;
    }

    // createdAt getter/setter
    get createdAt() {
        return this._createdAt;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    // updatedAt getter/setter
    get updatedAt() {
        return this._updatedAt;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }
}
