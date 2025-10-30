export class User {

    constructor(id, email, username, firstName, lastName, gender, biography, dateOfBirth, sexualPreference,userPassword, userStatus, createdAt, updatedAt) 
    {
        this._id = id;
        this._email = email;
        this._username = username;
        this._firstName = firstName;
        this._lastName = lastName;
        this._gender = gender;
        this._biography = biography;
        this._dateOfBirth = dateOfBirth;
        this._sexualPreference = sexualPreference;
        this._userPassword = userPassword;
        this._userStatus = userStatus;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        this._firstName = value;
    }

    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        this._lastName = value;
    }

    get gender() {
        return this._gender;
    }

    set gender(value) {
        this._gender = value;
    }

    get biography() {
        return this._biography;
    }

    set biography(value) {
        this._biography = value;
    }

    get dateOfBirth() {
        return this._dateOfBirth;
    }

    set dateOfBirth(value) {
        this._dateOfBirth = value;
    }

    get sexualPreference() {
        return this._sexualPreference;
    }

    set sexualPreference(value) {
        this._sexualPreference = value;
    }

    get userPassword() {
        return this._userPassword;
    }

    set userPassword(value) {
        this._userPassword = value;
    }

    get userStatus() {
        return this._userStatus;
    }

    set userStatus(value) {
        this._userStatus = value;
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
