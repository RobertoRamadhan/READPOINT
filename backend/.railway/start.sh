#!/bin/bash
set -e

echo "Starting READPOINT Laravel application..."

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

# Laravel will automatically use environment variables
echo "Environment:"
echo "  APP_ENV: $APP_ENV"
echo "  DB_HOST: $DB_HOST"
echo "  DB_DATABASE: $DB_DATABASE"

# Run migrations
echo "Running migrations..."
php artisan migrate --force || true

# Seed database if needed
echo "Seeding database..."
php artisan db:seed --force || true

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
