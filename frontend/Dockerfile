# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variable for build
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port 4001
EXPOSE 4001

# Set port environment variable
ENV PORT=4001
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
