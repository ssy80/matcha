import fs from "fs";

const inserts = [];

for (let i = 1; i <= 500; i++) {
  inserts.push(`INSERT INTO user_onlines (user_id) VALUES (${i});`);
}

fs.writeFileSync("user_onlines_seed.sql", inserts.join("\n"), "utf-8");

console.log("✅ Generated 500 INSERT statements into user_onlines_seed.sql");