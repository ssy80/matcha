import fs from "fs";

const pictures_female = [
  "p1.jpeg",
  "p2.jpeg",
  "p3.jpeg",
  "p4.jpeg",
  "p5.jpeg",
  "p6.jpeg",
  "p7.jpeg",
  "p9.jpeg",
  "p11.jpeg",
  "p13.jpeg",
  "p15.jpeg",
  "p16.jpeg",
  "p17.jpeg",
  "p18.jpeg",
  "p19.jpeg",
  "p20.jpeg",
  "p21.jpeg",
  "p28.jpeg",
  "p36.jpeg",
  "p38.jpeg",
  "p39.jpeg",
  "p41.jpg",
  "p42.jpg",
  "p43.jpg",
  "p44.jpg",
  "p45.jpg",
  "p46.jpg",
  "p47.jpg",
  "p48.jpg",
  "p49.jpg",
  "p50.jpg",
  "p51.jpg",
  "p52.jpg",
  "p53.jpg",
  "p54.jpg",
  "p55.jpg",
  "p56.jpg",
  "p57.jpg",
  "p58.jpg",
  "p59.jpg",
  "p60.jpg",
  "p61.jpg",
  "p62.jpg",
  "p63.jpg",
  "p64.jpg",
  "p65.jpg",
  "p66.jpg",
  "p67.jpg",
  "p68.jpg",
  "p69.jpg",
  "p70.jpg",
  "p71.jpg",
  "p72.jpg",
  "p73.jpg"
];

const pictures_male = [
  "p8.jpeg",
  "p10.jpeg",
  "p12.jpeg",
  "p14.jpeg",
  "p22.jpeg",
  "p23.jpeg",
  "p24.jpeg",
  "p25.jpeg",
  "p26.jpeg",
  "p27.jpeg",
  "p29.jpeg",
  "p30.jpeg",
  "p31.jpeg",
  "p32.jpeg",
  "p33.jpeg",
  "p34.jpeg",
  "p35.jpeg",
  "p37.jpeg",
  "p40.png",
  "p81.jpg",
  "p82.jpg",
  "p83.jpg",
  "p84.jpg",
  "p85.jpg",
  "p86.jpg",
  "p87.jpg",
  "p88.jpg",
  "p89.jpg",
  "p90.jpg",
  "p91.jpg",
  "p92.jpg",
  "p93.jpg",
  "p94.jpg",
  "p95.jpg",
  "p96.jpg",
  "p97.jpg",
  "p98.jpg",
  "p99.jpg",
  "p100.jpg",
  "p101.jpg",
  "p102.jpg",
  "p103.jpg",
  "p104.jpg",
  "p105.jpg",
  "p106.jpg",
  "p107.jpg",
  "p108.jpg",
  "p109.jpg",
  "p110.jpg",
  "p111.jpg",
  "p112.jpg",
  "p113.jpg",
  "p114.jpg",
  "p115.jpg"
];

const female_user_ids = [
  14, 15, 16, 17, 21, 22, 26, 28, 29, 31, 32, 33, 34, 35, 39, 41,
  44, 45, 47, 49, 50, 53, 55, 56, 57, 61, 64, 66, 67, 69, 72, 75,
  79, 81, 82, 83, 84, 86, 87, 88, 89, 90, 91, 92, 93, 95, 97, 98,
  99, 100, 101, 102, 104, 107, 108, 109, 110, 111, 112, 113, 117,
  118, 119, 123, 124, 125, 127, 128, 129, 130, 134, 136, 139, 142,
  143, 144, 145, 146, 155, 157, 159, 160, 161, 164, 173, 177, 178,
  180, 181, 182, 183, 189, 192, 193, 194, 199, 201, 203, 207, 210,
  212, 213, 216, 217, 220, 221, 222, 225, 228, 234, 236, 238, 239,
  241, 242, 244, 245, 246, 248, 249, 257, 260, 261, 266, 267, 271,
  273, 276, 278, 279, 282, 284, 285, 289, 290, 292, 295, 297, 298,
  299, 300, 302, 309, 310, 311, 312, 313, 314, 317, 318, 320, 321,
  322, 323, 329, 330, 332, 333, 338, 340, 342, 345, 347, 348, 349,
  351, 352, 354, 358, 360, 361, 362, 364, 365, 367, 368, 370, 372,
  373, 374, 376, 378, 379, 382, 385, 389, 391, 392, 393, 395, 396,
  397, 399, 401, 402, 404, 407, 408, 409, 410, 411, 412, 413, 418,
  419, 420, 421, 422, 423, 424, 425, 426, 429, 430, 432, 433, 434,
  435, 437, 439, 440, 442, 443, 445, 446, 448, 449, 450, 452, 453,
  456, 457, 458, 459, 461, 463, 465, 471, 472, 475, 476, 478, 480,
  481, 482, 488, 491, 492, 493, 495, 496, 498, 499, 500
];

const male_user_ids = [
  23, 24, 25, 27, 30, 36, 37, 38, 40, 42, 43, 46, 48, 51, 52, 54,
  58, 59, 60, 62, 63, 65, 68, 70, 71, 73, 74, 76, 77, 78, 80, 85,
  94, 96, 103, 105, 106, 114, 115, 116, 120, 121, 122, 126, 131,
  132, 133, 135, 137, 138, 140, 141, 147, 148, 149, 150, 151, 152,
  153, 154, 156, 158, 162, 163, 165, 166, 167, 168, 169, 170, 171,
  172, 174, 175, 176, 179, 184, 185, 186, 187, 188, 190, 191, 195,
  196, 197, 198, 200, 202, 204, 205, 206, 208, 209, 211, 214, 215,
  218, 219, 223, 224, 226, 227, 229, 230, 231, 232, 233, 235, 237,
  240, 243, 247, 250, 251, 252, 253, 254, 255, 256, 258, 259, 262,
  263, 264, 265, 268, 269, 270, 272, 274, 275, 277, 280, 281, 283,
  286, 287, 288, 291, 293, 294, 296, 301, 303, 304, 305, 306, 307,
  308, 315, 316, 319, 324, 325, 326, 327, 328, 331, 334, 335, 336,
  337, 339, 341, 343, 344, 346, 350, 353, 355, 356, 357, 359, 363,
  366, 369, 371, 375, 377, 380, 381, 383, 384, 386, 387, 388, 390,
  394, 398, 400, 403, 405, 406, 414, 415, 416, 417, 427, 428, 431,
  436, 438, 441, 444, 447, 451, 454, 455, 460, 462, 464, 466, 467,
  468, 469, 470, 473, 474, 477, 479, 483, 484, 485, 486, 487, 489,
  490, 494, 497
];

const other_user_ids = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 18, 19, 20
];


const inserts = [];

female_user_ids.forEach(userId => {

  // Random number of pictures (1–5)
  const numPics = Math.floor(Math.random() * 5) + 1;

  // Shuffle and pick pictures (no duplicates per user)
  const shuffled = [...pictures_female].sort(() => 0.5 - Math.random());
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

});

male_user_ids.forEach(userId => {

  // Random number of pictures (1–5)
  const numPics = Math.floor(Math.random() * 5) + 1;

  // Shuffle and pick pictures (no duplicates per user)
  const shuffled = [...pictures_male].sort(() => 0.5 - Math.random());
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

});

other_user_ids.forEach(userId => {

  const all_pictures = [...pictures_male, ...pictures_female];
  // Random number of pictures (1–5)
  const numPics = Math.floor(Math.random() * 5) + 1;

  // Shuffle and pick pictures (no duplicates per user)
  const shuffled = [...all_pictures].sort(() => 0.5 - Math.random());
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

});



fs.writeFileSync("user_pictures_seed.sql", inserts.join("\n"), "utf-8");

console.log(`✅ Generated ${inserts.length} INSERT statements for user_pictures_seed.sql`);