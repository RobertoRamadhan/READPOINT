#!/bin/bash
set -e

echo "Starting READPOINT Laravel application..."

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

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating APP_KEY..."
    php artisan key:generate
fi

echo "Application ready!"

# Start PHP-FPM in background
php-fpm -D

# Start Nginx in foreground
nginx -g "daemon off;"
