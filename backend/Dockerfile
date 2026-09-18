# Build and run stage using multi-stage lightweight Node Alpine
FROM node:20-alpine AS base

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install curl for container health check
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --ignore-scripts

# Copy application source code
COPY src ./src

# Create non-root user for security
USER node

# Expose backend port
EXPOSE 5000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start production server
CMD ["node", "src/server.js"]
