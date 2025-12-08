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

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get fromUserId() {
        return this._fromUserId;
    }

    set fromUserId(value) {
        this._fromUserId = value;
    }

    get toUserId() {
        return this._toUserId;
    }

    set toUserId(value) {
        this._toUserId = value;
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
    }

    get messageStatus() {
        return this._messageStatus;
    }

    set messageStatus(value) {
        this._messageStatus = value;
    }

    get createdAt() {
        return this._createdAt;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }

}
