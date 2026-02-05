export class UserOnline {

    constructor(user_id, is_online,createdAt, updatedAt)
    {
        this._user_id = user_id;
        this._is_online = is_online;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get userId() {
        return this._user_id;
    }

    set userId(value) {
        this._user_id = value;
    }

    get is_online() {
        return this._is_online;
    }

    set is_online(value) {
        this._is_online = value;
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
