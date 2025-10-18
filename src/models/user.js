/*
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_password VARCHAR(100) NOT NULL,
    user_status VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
*/

export class User {

    constructor(id, email, username, firstName, lastName, userPassword, userStatus, createdAt, updatedAt) 
    {
        this._id = id;
        this._email = email;
        this._username = username;
        this._firstName = firstName;
        this._lastName = lastName;
        this._userPassword = userPassword;
        this._userStatus = userStatus;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    // ID
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    // Email
    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    // Username
    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    // First Name
    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        this._firstName = value;
    }

    // Last Name
    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        this._lastName = value;
    }

    // User Password
    get userPassword() {
        return this._userPassword;
    }

    set userPassword(value) {
        this._userPassword = value;
    }

    // User Status
    get userStatus() {
        return this._userStatus;
    }

    set userStatus(value) {
        this._userStatus = value;
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
    /*getUser(){
        return {
            "id": this.id,
            
        }
    }
    updateTimestamp() {
        this.updatedAt = new Date();
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    toString() {
        return `User(id=${this.id}, username='${this.username}', email='${this.email}')`;
    }*/
}

// Usage
/*const user = new User({
    email: "john@example.com",
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    userPassword: "hashed_password",
    userStatus: "active"
});*/