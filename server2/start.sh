#!/bin/sh
set -e

echo "=== Starting Service Initialization ==="
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Function to check service with detailed logging
check_service() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    echo "=== Checking $service on port $port ==="
    echo "Attempt $attempt of $max_attempts"
    
    while [ $attempt -le $max_attempts ]; do
        echo "Testing connection to $service:$port..."
        if nc -z $service $port; then
            echo "✅ Successfully connected to $service on port $port"
            return 0
        else
            echo "❌ Failed to connect to $service:$port (Attempt $attempt/$max_attempts)"
            attempt=$((attempt + 1))
            if [ $attempt -le $max_attempts ]; then
                echo "Waiting 2 seconds before next attempt..."
                sleep 2
            fi
        fi
    done
    
    echo "❌ Failed to connect to $service after $max_attempts attempts"
    return 1
}

# Check services with detailed logging
echo "=== Starting Service Checks ==="

echo "Checking PostgreSQL..."
if ! check_service "postgres" "5432"; then
    echo "❌ PostgreSQL service check failed"
    exit 1
fi

echo "Checking Redis..."
if ! check_service "redis" "6379"; then
    echo "❌ Redis service check failed"
    exit 1
fi

echo "=== All Services Are Up ==="

# Set environment variables
echo "=== Setting Environment Variables ==="
export NODE_ENV=production
export REDIS_URL=redis://redis:6379
export DB_HOST=postgres
export DB_PORT=5432
export DB_NAME=echo
export DB_USER=postgres
export DB_PASSWORD=postgres

# Print environment variables (excluding sensitive data)
echo "Environment variables set:"
echo "NODE_ENV: $NODE_ENV"
echo "REDIS_URL: $REDIS_URL"
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "DB_NAME: $DB_NAME"

# Verify Node.js installation
echo "=== Verifying Node.js Installation ==="
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Check if dist directory exists
echo "=== Checking Build Directory ==="
if [ ! -d "dist" ]; then
    echo "❌ dist directory not found!"
    echo "Current directory contents:"
    ls -la
    exit 1
fi

echo "dist directory contents:"
ls -la dist/

# Start the application with detailed logging
echo "=== Starting Node.js Application ==="
echo "Starting node dist/app.js..."
exec node dist/app.js 