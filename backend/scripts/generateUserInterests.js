import fs from "fs";

const interests = [
  '#music', '#movie', '#gym', '#swim', '#jog', '#cycle',
  '#animal', '#vegan', '#dinner', '#travel', '#dance'
];

const totalUsers = 500;
const inserts = [];
let totalCount = 0;

for (let userId = 1; userId <= totalUsers; userId++) {
  const numInterests = Math.floor(Math.random() * 5) + 1;
  const shuffled = interests.sort(() => 0.5 - Math.random());
  const userInterests = shuffled.slice(0, numInterests);

  for (const interest of userInterests) {
    inserts.push(
      `INSERT INTO user_interests (user_id, interest) VALUES (${userId}, '${interest}');`
    );
    totalCount++;
  }
}

if (totalCount > 2000) inserts.length = 2000;

fs.writeFileSync("user_interests_seed.sql", inserts.join("\n"), "utf-8");

console.log(`✅ Generated ${inserts.length} INSERT statements into user_interests_seed.sql`);