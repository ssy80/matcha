export class FameRating {

    constructor(userId, likedCount, createdAt, updatedAt)
    {
        this._userId = userId;
        this._likedCount = likedCount;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get userId() {
        return this._userId;
    }

    get likedCount() {
        return this._likedCount;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    set userId(value) {
        this._userId = value;
    }

    set likedCount(value) {
        this._likedCount = value;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }

}
