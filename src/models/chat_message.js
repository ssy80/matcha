

/*
CREATE TABLE chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user_id INTEGER NOT NULL,
    to_user_id INTEGER NOT NULL,
    message VARCHAR(500) NOT NULL,
    message_status varchar(30) NOT NULL,           -- new, sent, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_user_id) REFERENCES users(id)
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
    FOREIGN KEY (to_user_id) REFERENCES users(id)
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);
*/

export class ChatMessage {

    constructor(id, fromUserId, toUserId, message, messageStatus, createdAt, updatedAt)
    {
        this._id = id;
        this._fromUserId = fromUserId;
        this._toUserId = toUserId;
        this._message = message;
        this._messageStatus = messageStatus;
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

    // fromUserId getter/setter
    get fromUserId() {
        return this._fromUserId;
    }

    set fromUserId(value) {
        this._fromUserId = value;
    }

    // toUserId getter/setter
    get toUserId() {
        return this._toUserId;
    }

    set toUserId(value) {
        this._toUserId = value;
    }

    // message getter/setter
    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
    }

    // messageStatus getter/setter
    get messageStatus() {
        return this._messageStatus;
    }

    set messageStatus(value) {
        this._messageStatus = value;
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