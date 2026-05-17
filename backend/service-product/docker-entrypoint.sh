#!/bin/sh
set -e

php artisan migrate --force --no-interaction || {
    echo "Migration failed, recreating database schema..."
    php artisan migrate:fresh --force --no-interaction
}

php artisan config:clear

exec php artisan serve --host=0.0.0.0 --port=8000
