#!/bin/bash
set -e

echo "=========================================="
echo "Starting READPOINT Laravel Application"
echo "=========================================="

# Convert Railway MYSQL_* variables to Laravel DB_* format
export DB_HOST=${MYSQL_HOST:-localhost}
export DB_PORT=${MYSQL_PORT:-3306}
export DB_DATABASE=${MYSQL_DATABASE:-railway}
export DB_USERNAME=${MYSQL_USER:-root}
export DB_PASSWORD=${MYSQL_PASSWORD:-}
export APP_ENV=${APP_ENV:-production}
export APP_DEBUG=${APP_DEBUG:-false}
export APP_URL=${APP_URL:-https://readpoint-production.up.railway.app}

echo "Configuration:"
echo "  APP_ENV: $APP_ENV"
echo "  APP_DEBUG: $APP_DEBUG"
echo "  DB_HOST: $DB_HOST"
echo "  DB_PORT: $DB_PORT"
echo "  DB_DATABASE: $DB_DATABASE"
echo "  DB_USERNAME: $DB_USERNAME"

# Generate .env if not exists
if [ ! -f /app/.env ]; then
    echo "Generating .env from .env.example..."
    cp /app/.env.example /app/.env
fi

# Update .env with environment variables
echo "Updating .env with environment variables..."
sed -i "s/^DB_HOST=.*/DB_HOST=$DB_HOST/" /app/.env
sed -i "s/^DB_PORT=.*/DB_PORT=$DB_PORT/" /app/.env
sed -i "s/^DB_DATABASE=.*/DB_DATABASE=$DB_DATABASE/" /app/.env
sed -i "s/^DB_USERNAME=.*/DB_USERNAME=$DB_USERNAME/" /app/.env
sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" /app/.env
sed -i "s/^APP_ENV=.*/APP_ENV=$APP_ENV/" /app/.env
sed -i "s/^APP_DEBUG=.*/APP_DEBUG=$APP_DEBUG/" /app/.env
sed -i "s|^APP_URL=.*|APP_URL=$APP_URL|" /app/.env

# Generate APP_KEY if not in .env
if ! grep -q "APP_KEY=base64:" /app/.env; then
    echo "Generating APP_KEY..."
    php artisan key:generate --env=production --force 2>&1 || echo "Warning: Could not generate APP_KEY"
fi

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
for i in {1..30}; do
    if php -r "mysqli_connect('$DB_HOST', '$DB_USERNAME', '$DB_PASSWORD');" 2>/dev/null; then
        echo "MySQL is ready!"
        break
    fi
    echo "Waiting for MySQL... ($i/30)"
    sleep 1
done

# Run migrations
echo "Running database migrations..."
php artisan migrate --force 2>&1 || echo "Warning: Migration may have failed, continuing..."

# Seed database
echo "Seeding database..."
php artisan db:seed --force 2>&1 || echo "Warning: Seed may have failed, continuing..."

# Clear and optimize caches
echo "Optimizing application..."
php artisan config:clear 2>&1 || true
php artisan cache:clear 2>&1 || true
php artisan view:clear 2>&1 || true
php artisan route:clear 2>&1 || true
php artisan optimize:clear 2>&1 || true

echo "=========================================="
echo "Application ready!"
echo "=========================================="

# Start PHP-FPM in background
echo "Starting PHP-FPM..."
php-fpm -D

# Wait a moment for PHP-FPM to start
sleep 2

# Start Nginx in foreground
echo "Starting Nginx..."
nginx -g "daemon off;"
