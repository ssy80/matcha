export class UserOnline {

    constructor(user_id, createdAt, updatedAt)
    {
        this._user_id = user_id;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get userId() {
        return this._user_id;
    }

    set userId(value) {
        this._user_id = value;
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
