#!/bin/bash

# Install dependencies
composer install --no-dev --optimize-autoloader --no-interaction

# Run migrations
php artisan migrate --force --no-interaction

# Start server
php -S 0.0.0.0:$PORT -t public