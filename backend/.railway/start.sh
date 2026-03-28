#!/bin/bash
set -e

echo "Starting READPOINT Laravel application..."

# Convert Railway MYSQL_* variables to Laravel DB_* format
export DB_HOST=${MYSQL_HOST:-127.0.0.1}
export DB_PORT=${MYSQL_PORT:-3306}
export DB_DATABASE=${MYSQL_DATABASE:-railway}
export DB_USERNAME=${MYSQL_USER:-root}
export DB_PASSWORD=${MYSQL_PASSWORD:-}

echo "Database Configuration:"
echo "  DB_HOST: $DB_HOST"
echo "  DB_PORT: $DB_PORT"
echo "  DB_DATABASE: $DB_DATABASE"
echo "  DB_USERNAME: $DB_USERNAME"

# Generate .env if not exists
if [ ! -f /app/.env ]; then
    echo "Generating .env from .env.example..."
    cp /app/.env.example /app/.env
fi

# Generate APP_KEY if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating APP_KEY..."
    php artisan key:generate --env=production || true
    grep -q "APP_KEY=base64:" /app/.env || php artisan key:generate --force
fi

# Run migrations
echo "Running migrations..."
php artisan migrate --force 2>&1 || true

# Seed database if needed
echo "Seeding database..."
php artisan db:seed --force 2>&1 || true

# Clear caches
echo "Clearing caches..."
php artisan cache:clear || true
php artisan view:clear || true
php artisan config:clear || true
php artisan route:clear || true

echo "Application ready!"

# Start PHP-FPM in background
php-fpm -D

# Start Nginx in foreground
nginx -g "daemon off;"
