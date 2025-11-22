# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Accept build argument for DATABASE_URL
ARG DATABASE_URL

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client (needs DATABASE_URL for validation)
RUN DATABASE_URL="${DATABASE_URL:-mongodb://placeholder}" npx prisma generate

# Build TypeScript
RUN npm run build

# Copy non-TypeScript files (CSS, etc.) to dist
RUN mkdir -p dist/configs && \
    cp -r src/configs/*.css dist/configs/ 2>/dev/null || true

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production

# Copy necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "dist/index.js"]
