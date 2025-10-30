export class UserReset {

    constructor(id, resetUuid, resetStatus, expiredAt, userId, createdAt, updatedAt) 
    {
        this._id = id;
        this._resetUuid = resetUuid;
        this._resetStatus = resetStatus;
        this._userId = userId;
        this._expiredAt = expiredAt;        
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get id() {
        return this._id;
    }

    get resetUuid() {
        return this._resetUuid;
    }

    get resetStatus() {
        return this._resetStatus;
    }

    get expiredAt() {
        return this._expiredAt;
    }

    get userId() {
        return this._userId;
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

    set resetUuid(value) {
        this._resetUuid = value;
    }

    set resetStatus(value) {
        this._resetStatus = value;
    }

    set expiredAt(value) {
        this._expiredAt = value;
    }

    set userId(value) {
        this._userId = value;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }

}
