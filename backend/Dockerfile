FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    zip \
    unzip \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy application code
COPY . .

# Copy .env.example to .env for Laravel
RUN cp .env.example .env && \
    composer install --no-dev --optimize-autoloader --no-interaction && \
    mkdir -p storage/logs && chmod -R 775 storage bootstrap/cache

# Copy nginx config
COPY nginx.conf /etc/nginx/sites-available/default

# Expose port
EXPOSE 8080

# Start nginx and PHP-FPM
CMD php artisan migrate --force; php-fpm -D; nginx -g "daemon off;"
