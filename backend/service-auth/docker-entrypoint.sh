#!/bin/sh
set -e

php artisan migrate --force --no-interaction
php artisan l5-swagger:generate

exec php artisan serve --host=0.0.0.0 --port=8000
