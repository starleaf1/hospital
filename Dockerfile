# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Generate Prisma Client
RUN npm run prisma:generate

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --omit=dev

# Generate Prisma client for production
RUN npm run prisma:generate

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["npm", "start"]
