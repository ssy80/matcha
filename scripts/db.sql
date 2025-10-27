
drop table users;
drop table user_activations;
drop table user_resets;
--drop table user_sexual_preferences;
drop table user_interests;
drop table user_pictures;
drop table viewed_histories;
drop table liked_histories;
drop table fame_ratings;
drop table user_locations;
drop table user_onlines;
drop table user_blockeds;

--email address, username, last name, first name, password

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    biography VARCHAR(500),
    date_of_birth TEXT CHECK(date_of_birth IS NULL OR date_of_birth = strftime('%Y-%m-%d', date_of_birth)),
    sexual_preference VARCHAR(20),
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
/*CREATE TABLE user_profiles (
    user_id INTEGER NOT NULL,
    gender VARCHAR(20),
    biography VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);*/


/*CREATE TABLE user_sexual_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    preference VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, preference),
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);*/


CREATE TABLE user_interests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    interest VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, picture),
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);

--  - Users must be able to see who has viewed their profile.  -- view history
--    - Users must also be able to see who has “liked” them.     --like history
CREATE TABLE viewed_histories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    viewed_user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
    FOREIGN KEY (viewed_user_id) REFERENCES users(id)
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);

CREATE TABLE liked_histories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    liked_user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION,
    FOREIGN KEY (liked_user_id) REFERENCES users(id)
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);


CREATE TABLE fame_ratings (
    user_id INTEGER PRIMARY KEY NOT NULL,
    liked_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);


--event TABLE

--location table

/*CREATE TABLE fame_ratings (
    user_id INTEGER NOT NULL,
    liked_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);*/


CREATE TABLE user_locations (
    user_id INTEGER PRIMARY KEY NOT NULL,
    latitude REAL,                        -- e.g., 40.712776
    longitude REAL,                       -- e.g., -74.005974
    neighborhood VARCHAR(100),            -- Extracted neighborhood name/ suburb 
    city VARCHAR(100),
    country VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);


CREATE TABLE user_onlines (
    user_id INTEGER PRIMARY KEY NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);


CREATE TABLE user_blockeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    blocked_user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE NO ACTION,
    FOREIGN KEY (blocked_user_id) REFERENCES users(id)
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
);