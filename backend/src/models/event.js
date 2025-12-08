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

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    get fromUserId() {
        return this._fromUserId;
    }

    set fromUserId(value) {
        this._fromUserId = value;
    }

    get eventType() {
        return this._eventType;
    }

    set eventType(value) {
        this._eventType = value;
    }

    get eventStatus() {
        return this._eventStatus;
    }

    set eventStatus(value) {
        this._eventStatus = value;
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
