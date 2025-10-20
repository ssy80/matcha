--email address, username, last name, first name, password

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_password VARCHAR(100) NOT NULL,
    user_status VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE user_activations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activation_uuid VARCHAR(100) NOT NULL UNIQUE,
    activation_status VARCHAR(50) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);


CREATE TABLE user_resets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reset_uuid VARCHAR(100) NOT NULL UNIQUE,
    reset_status VARCHAR(50) NOT NULL,
    expired_at DATETIME NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);


-- gender, sexual preferences, biography, list of interests, 5 pictures(1 for profile)
CREATE TABLE user_profiles (
    user_id INTEGER NOT NULL,
    gender VARCHAR(20) NOT NULL,
    biography VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);


CREATE TABLE user_sexual_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    preference VARCHAR(100) NOT NULL,
    UNIQUE (user_id, preference),
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);


CREATE TABLE user_interests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    interest VARCHAR(100) NOT NULL,
    UNIQUE (user_id, interest),
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);


CREATE TABLE user_pictures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    picture VARCHAR(200) NOT NULL,
    is_profile_picture INTEGER DEFAULT 0,
    UNIQUE (user_id, picture),
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);
