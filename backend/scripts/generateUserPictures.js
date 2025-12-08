import fs from "fs";

const pictures = [
  "p1.jpeg", "p2.jpeg", "p3.jpeg", "p4.jpeg", "p5.jpeg",
  "p6.jpeg", "p7.jpeg", "p8.jpeg", "p9.jpeg", "p10.jpeg",
  "p11.jpeg", "p12.jpeg", "p13.jpeg", "p14.jpeg", "p15.jpeg",
  "p16.jpeg", "p17.jpeg", "p18.jpeg", "p19.jpeg", "p20.jpeg",
  "p21.jpeg", "p22.jpeg", "p23.jpeg", "p24.jpeg", "p25.jpeg",
  "p26.jpeg", "p27.jpeg", "p28.jpeg", "p29.jpeg", "p30.jpeg",
  "p31.jpeg", "p32.jpeg", "p33.jpeg", "p34.jpeg", "p35.jpeg",
  "p36.jpeg", "p37.jpeg", "p38.jpeg", "p39.jpeg", "p40.png"
];

const totalUsers = 500;
const inserts = [];

for (let userId = 1; userId <= totalUsers; userId++) {
  // Random number of pictures (1–5)
  const numPics = Math.floor(Math.random() * 5) + 1;

  // Shuffle and pick pictures (no duplicates per user)
  const shuffled = [...pictures].sort(() => 0.5 - Math.random());
  const selectedPics = shuffled.slice(0, numPics);

  // Randomly select 1 as profile picture
  const profileIndex = Math.floor(Math.random() * selectedPics.length);

  for (let i = 0; i < selectedPics.length; i++) {
    const pic = selectedPics[i];
    const isProfile = i === profileIndex ? 1 : 0;
    inserts.push(
      `INSERT INTO user_pictures (user_id, picture, is_profile_picture) VALUES (${userId}, '${pic}', ${isProfile});`
    );
  }
}

fs.writeFileSync("user_pictures_seed.sql", inserts.join("\n"), "utf-8");

console.log(`✅ Generated ${inserts.length} INSERT statements for user_pictures_seed.sql`);