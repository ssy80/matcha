export class LikedHistory {

    constructor(id, userId, likedUserId, createdAt, updatedAt)
    {
        this._id = id;
        this._userId = userId;
        this._likedUserId = likedUserId;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get id() {
        return this._id;
    }

    get userId() {
        return this._userId;
    }

    get likedUserId() {
        return this._likedUserId;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    set id(value) {
        this._id = value;
    }

    set userId(value) {
        this._userId = value;
    }

    set likedUserId(value) {
        this._likedUserId = value;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }
}
