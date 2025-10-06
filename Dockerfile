# Use official Node.js image as base
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port your app runs on
EXPOSE 80

# Command to run your app
CMD ["node", "server.js"]
