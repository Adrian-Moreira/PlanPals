# Use a Node.js image as base
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the React app code
COPY . .

# Build the React app
RUN npm run build

# Serve the built app
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
