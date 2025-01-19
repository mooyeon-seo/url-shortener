#!/bin/sh
set -e

# Wait for database to be ready (simple retry mechanism)
echo "Waiting for database..."
for i in $(seq 1 30); do
    npx prisma migrate deploy && break
    echo "Migration attempt $i failed, retrying in 1s..."
    sleep 1
done

# Start the application
exec yarn start