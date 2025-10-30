export class UserBlocked {

    constructor(id, userId, blockedUserId, createdAt, updatedAt)
    {
        this._id = id;
        this._userId = userId;
        this._blockedUserId = blockedUserId;
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

    get blockedUserId() {
        return this._blockedUserId;
    }

    set blockedUserId(value) {
        this._blockedUserId = value;
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
