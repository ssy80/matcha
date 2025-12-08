export class UserLocation {

    constructor(userId, latitude, longitude, neighborhood, city, country, createdAt, updatedAt)
    {
        this._userId = userId;
        this._latitude = latitude;
        this._longitude = longitude;
        this._neighborhood = neighborhood;
        this._city = city;
        this._country = country;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get userId() {
        return this._userId;
    }

    get latitude() {
        return this._latitude;
    }

    get longitude() {
        return this._longitude;
    }

    get neighborhood() {
        return this._neighborhood;
    }

    get city() {
        return this._city;
    }

    get country() {
        return this._country;
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

    set latitude(value) {
        this._latitude = value;
    }

    set longitude(value) {
        this._longitude = value;
    }

    set neighborhood(value) {
        this._neighborhood = value;
    }

    set city(value) {
        this._city = value;
    }

    set country(value) {
        this._country = value;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    set updatedAt(value) {
        this._updatedAt = value;
    }
}
