export class UserInterest {

    constructor(id, userId, interest, createdAt, updatedAt)
    {
        this._id = id;
        this._userId = userId;
        this._interest = interest;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get id() {
        return this._id;
    }

    get userId() {
        return this._userId;
    }

    get interest() {
        return this._interest;
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

    set interest(value) {
        this._interest = value;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }
}
