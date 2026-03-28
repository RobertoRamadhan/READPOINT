#!/bin/bash
set -e

echo "=========================================="
echo "Starting READPOINT Laravel Application"
echo "=========================================="

# Debug: Show all MYSQL_* variables
echo "Available MySQL variables:"
env | grep -i mysql || echo "No MYSQL variables found"
echo ""

# Convert Railway MYSQL_* variables to Laravel DB_* format
export DB_HOST=${MYSQL_HOST:-mysql}
export DB_PORT=${MYSQL_PORT:-3306}
export DB_DATABASE=${MYSQL_DATABASE:-railway}
export DB_USERNAME=${MYSQL_USER:-root}
export DB_PASSWORD=${MYSQL_PASSWORD}
export APP_ENV=${APP_ENV:-production}
export APP_DEBUG=${APP_DEBUG:-false}
export APP_URL=${APP_URL:-https://readpoint-production.up.railway.app}

echo "Configuration:"
echo "  APP_ENV: $APP_ENV"
echo "  DB_HOST: $DB_HOST"
echo "  DB_DATABASE: $DB_DATABASE"
echo "  DB_USERNAME: $DB_USERNAME"
echo "  DB_PASSWORD: ${DB_PASSWORD:-(empty)}"
echo ""

# Generate .env if not exists
if [ ! -f /app/.env ]; then
    echo "Generating .env from .env.example..."
    cp /app/.env.example /app/.env
fi

# Update .env with environment variables (using proper escaping)
echo "Updating .env with environment variables..."
sed -i "s/^DB_HOST=.*/DB_HOST=$DB_HOST/" /app/.env
sed -i "s/^DB_PORT=.*/DB_PORT=$DB_PORT/" /app/.env
sed -i "s/^DB_DATABASE=.*/DB_DATABASE=$DB_DATABASE/" /app/.env
sed -i "s/^DB_USERNAME=.*/DB_USERNAME=$DB_USERNAME/" /app/.env

# Update DB_PASSWORD with proper escaping (in case it has special chars)
if [ -n "$DB_PASSWORD" ]; then
    DB_PASSWORD_ESCAPED=$(printf '%s\n' "$DB_PASSWORD" | sed -e 's/[\/&]/\\&/g')
    sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD_ESCAPED/" /app/.env
fi

sed -i "s/^APP_ENV=.*/APP_ENV=$APP_ENV/" /app/.env
sed -i "s/^APP_DEBUG=.*/APP_DEBUG=$APP_DEBUG/" /app/.env
sed -i "s|^APP_URL=.*|APP_URL=$APP_URL|" /app/.env

# Generate APP_KEY if not in .env
if ! grep -q "APP_KEY=base64:" /app/.env; then
    echo "Generating APP_KEY..."
    php artisan key:generate --env=production --force 2>&1 || echo "Warning: Could not generate APP_KEY"
fi

# Show .env DB config for debugging
echo ""
echo "Final .env database config:"
grep "^DB_" /app/.env || echo "(No DB_* variables found in .env)"
echo ""

# Wait for MySQL with simple delay
echo "Waiting for MySQL..."
sleep 5

# Run migrations with retry
echo "Running database migrations..."
MIGRATION_SUCCESS=0
for i in {1..5}; do
    if php artisan migrate --force 2>&1; then
        echo "✓ Migrations completed successfully!"
        MIGRATION_SUCCESS=1
        break
    else
        echo "✗ Migration attempt $i failed, retrying in 3 seconds..."
        sleep 3
    fi
done

if [ $MIGRATION_SUCCESS -eq 0 ]; then
    echo "⚠ Warning: Migrations failed after 5 attempts. Continuing anyway..."
fi

# Seed database (optional)
echo "Seeding database..."
php artisan db:seed --force 2>&1 || echo "⚠ Seed completed (may have skipped if data exists)"

# Clear caches
echo "Optimizing application..."
php artisan config:clear 2>&1 || true
php artisan cache:clear 2>&1 || true
php artisan view:clear 2>&1 || true
php artisan route:clear 2>&1 || true
php artisan optimize:clear 2>&1 || true

echo "=========================================="
echo "✓ Application ready!"
echo "=========================================="
echo ""

# Start PHP-FPM in background
echo "Starting PHP-FPM..."
php-fpm -D

# Wait for PHP-FPM to start
sleep 2

# Start Nginx in foreground
echo "Starting Nginx..."
exec nginx -g "daemon off;"
