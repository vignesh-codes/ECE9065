# Stage 1: Build
FROM node:22 as builder

WORKDIR /app

# Copy package.json and package-lock.json first (to leverage Docker cache)
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY server/ ./

# Stage 2: Final image
FROM node:22-alpine as stage-1

WORKDIR /app

# Copy from builder stage
COPY --from=builder /app /app

# Expose port and start the application
EXPOSE 3000
CMD ["npm", "start"]
