


export class UserOnline {

    constructor(user_id, createdAt, updatedAt)
    {
        this._user_id = user_id;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    // User ID
    get userId() {
        return this._user_id;
    }

    set userId(value) {
        this._user_id = value;
    }

    // Created At
    get createdAt() {
        return this._createdAt;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    // Updated At
    get updatedAt() {
        return this._updatedAt;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }
}