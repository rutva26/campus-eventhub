# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (cached until package.json changes)
RUN npm ci --only=production

# Copy application code
COPY server.js app.js ./

# Stage 2: Runtime
FROM node:20-slim

WORKDIR /app

# Create non-root user for security
RUN useradd -m appuser

# Copy only production dependencies and app from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/*.js ./

# Set environment
ENV NODE_ENV=production

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["node", "server.js"]
