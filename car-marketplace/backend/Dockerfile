# Backend Dockerfile for BG Car Platform
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]