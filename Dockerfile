# Stage 1: Install dependencies and build the application
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json  ./

COPY prisma ./prisma/

# Install dependencies
RUN yarn

# Copy all source code into the container
COPY . .

RUN npx prisma generate

# Build the Next.js application
RUN yarn build

# Stage 2: Production image
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

# Create an entrypoint script to handle startup
COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

# Expose the port that the app will run on
EXPOSE 3000

# Start the application
ENTRYPOINT ["./docker-entrypoint.sh"]