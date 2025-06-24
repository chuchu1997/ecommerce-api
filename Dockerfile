FROM node:18-alpine

WORKDIR /app

# Cài package
COPY package*.json ./
RUN npm install

# Copy toàn bộ source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS App
RUN npm run build


RUN npm run start


EXPOSE 3000


