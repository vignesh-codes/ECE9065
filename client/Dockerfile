# Stage 1: Build
FROM node:22 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY client/package*.json ./
RUN npm install

# Copy application files
COPY client/ ./client
RUN ls
# Navigate to the client directory for the build
WORKDIR /app/client


EXPOSE 5173

CMD ["npm", "run", "dev", "--host"]
