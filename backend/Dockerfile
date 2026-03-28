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

# Install composer dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction && \
    mkdir -p storage/logs && chmod -R 775 storage bootstrap/cache

# Copy nginx config
COPY nginx.conf /etc/nginx/sites-available/default

# Copy startup script
COPY .railway/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose port
EXPOSE 8080

# Start application
CMD ["/app/start.sh"]
