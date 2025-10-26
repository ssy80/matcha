import fs from "fs";

// Available sexual preferences
const sexual_preferences = ["male", "female", "bi-sexual"];

// Total users
const totalUsers = 500;
const inserts = [];

for (let userId = 1; userId <= totalUsers; userId++) {
  // Randomly select one preference
  const preference =
    sexual_preferences[Math.floor(Math.random() * sexual_preferences.length)];

  inserts.push(
    `INSERT INTO user_sexual_preferences (user_id, preference) VALUES (${userId}, '${preference}');`
  );
}

// Save all statements to a .sql file
fs.writeFileSync("user_sexual_preferences_seed.sql", inserts.join("\n"), "utf-8");

console.log(`✅ Generated ${inserts.length} INSERT statements into user_sexual_preferences_seed.sql`);
