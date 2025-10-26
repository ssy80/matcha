import fs from "fs";

const totalUsers = 500;
const inserts = [];

for (let userId = 1; userId <= totalUsers; userId++) {
  const likedCount = Math.floor(Math.random() * 451); // random number 0–450
  inserts.push(
    `INSERT INTO fame_ratings (user_id, liked_count) VALUES (${userId}, ${likedCount});`
  );
}

fs.writeFileSync("fame_ratings_seed.sql", inserts.join("\n"), "utf-8");

console.log(`✅ Generated ${inserts.length} INSERT statements for fame_ratings_seed.sql`);