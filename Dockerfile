# Stage 1: Build
FROM node:22-slim AS builder

WORKDIR /app

# Install OpenSSL and other necessary packages for build stage
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy only package files first to leverage Docker layer caching
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client (if using Prisma)
RUN npx prisma generate

# Build the project (creates dist folder)
RUN npm run build

# Stage 2: Run
FROM node:22-slim

WORKDIR /app

# Install OpenSSL and curl for runtime (curl dùng cho wait-for-it)
RUN apt-get update -y && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

# Copy only package files to install only production dependencies
COPY package*.json ./
RUN npm install

# Copy built application and generated Prisma client from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts




# Expose the port your app listens on
EXPOSE 3000

# Start the app AFTER waiting for MySQL to be ready

CMD ["npm", "run", "start:prod"]

