# Use official Node.js LTS image
FROM node:18

# Set the working directory
#WORKDIR /usr/src/app
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install --production
#RUN npm install #full install for development

# Copy project files
COPY . .

# Expose the port your app runs on (adjust if different)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]