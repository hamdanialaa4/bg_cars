# Multi-stage Docker build for BG Car Platform
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy dependencies from base stage
COPY --from=base /app/node_modules ./node_modules

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]