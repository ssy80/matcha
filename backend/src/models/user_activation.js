export class UserActivation {

    constructor(id, activationUuid, activationStatus, userId, createdAt, updatedAt) 
    {
        this._id = id;
        this._activationUuid = activationUuid;
        this._activationStatus = activationStatus;
        this._userId = userId;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get id() {
        return this._id;
    }

    get activationUuid() {
        return this._activationUuid;
    }

    get activationStatus() {
        return this._activationStatus;
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

    set activationUuid(value) {
        this._activationUuid = value;
    }

    set activationStatus(value) {
        this._activationStatus = value;
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
