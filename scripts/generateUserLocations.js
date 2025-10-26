import fs from "fs";

const totalUsers = 500;

// Some representative areas in Singapore with approximate coordinates
const singaporeLocations = [
  { neighborhood: "Tampines", city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.945 },
  { neighborhood: "Bedok", city: "Singapore", country: "Singapore", lat: 1.3245, lng: 103.930 },
  { neighborhood: "Ang Mo Kio", city: "Singapore", country: "Singapore", lat: 1.3691, lng: 103.845 },
  { neighborhood: "Woodlands", city: "Singapore", country: "Singapore", lat: 1.436, lng: 103.786 },
  { neighborhood: "Jurong East", city: "Singapore", country: "Singapore", lat: 1.3331, lng: 103.743 },
  { neighborhood: "Clementi", city: "Singapore", country: "Singapore", lat: 1.3151, lng: 103.764 },
  { neighborhood: "Bukit Timah", city: "Singapore", country: "Singapore", lat: 1.329, lng: 103.802 },
  { neighborhood: "Orchard", city: "Singapore", country: "Singapore", lat: 1.3048, lng: 103.8318 },
  { neighborhood: "Yishun", city: "Singapore", country: "Singapore", lat: 1.429, lng: 103.835 },
  { neighborhood: "Pasir Ris", city: "Singapore", country: "Singapore", lat: 1.3733, lng: 103.949 },
  { neighborhood: "Serangoon", city: "Singapore", country: "Singapore", lat: 1.350, lng: 103.869 },
  { neighborhood: "Hougang", city: "Singapore", country: "Singapore", lat: 1.372, lng: 103.889 },
  { neighborhood: "Bishan", city: "Singapore", country: "Singapore", lat: 1.351, lng: 103.849 },
  { neighborhood: "Toa Payoh", city: "Singapore", country: "Singapore", lat: 1.334, lng: 103.851 },
  { neighborhood: "Punggol", city: "Singapore", country: "Singapore", lat: 1.406, lng: 103.902 },
  { neighborhood: "Sengkang", city: "Singapore", country: "Singapore", lat: 1.392, lng: 103.895 },
  { neighborhood: "Bukit Batok", city: "Singapore", country: "Singapore", lat: 1.349, lng: 103.749 },
  { neighborhood: "Bukit Panjang", city: "Singapore", country: "Singapore", lat: 1.378, lng: 103.762 },
  { neighborhood: "Kallang", city: "Singapore", country: "Singapore", lat: 1.311, lng: 103.871 },
  { neighborhood: "Marine Parade", city: "Singapore", country: "Singapore", lat: 1.302, lng: 103.905 },
];

function randomOffset(value, range = 0.01) {
  // add small variation to lat/lng to avoid duplicates
  return (value + (Math.random() - 0.5) * range).toFixed(6);
}

const inserts = [];

for (let userId = 1; userId <= totalUsers; userId++) {
  const loc = singaporeLocations[Math.floor(Math.random() * singaporeLocations.length)];
  const lat = randomOffset(loc.lat);
  const lng = randomOffset(loc.lng);

  inserts.push(
    `INSERT INTO user_locations (user_id, latitude, longitude, neighborhood, city, country)
     VALUES (${userId}, ${lat}, ${lng}, '${loc.neighborhood}', '${loc.city}', '${loc.country}');`
  );
}

fs.writeFileSync("user_locations_seed.sql", inserts.join("\n"), "utf-8");

console.log(`✅ Generated ${inserts.length} INSERT statements for user_locations_seed.sql`);
