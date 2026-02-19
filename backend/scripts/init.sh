#!/bin/bash

# Connect to sqlitee3 matcha.db and load data
sqlite3 ../database/matcha.db <<'EOF'
.read db.sql
.read users_seed.sql
.read user_onlines_seed.sql
.read user_locations_seed.sql
.read user_pictures_seed.sql
.read user_interests_seed.sql
.read fame_ratings_seed.sql
EOF
