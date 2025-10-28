
export class UserFaked {

    constructor(id, userId, fakedUserId, createdAt, updatedAt)
    {
        this._id = id;
        this._userId = userId;
        this._fakedUserId = fakedUserId;
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

    get fakedUserId() {
        return this._fakedUserId;
    }

    set fakedUserId(value) {
        this._fakedUserId = value;
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