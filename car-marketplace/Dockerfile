# Main Dockerfile for BG Car Platform
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]