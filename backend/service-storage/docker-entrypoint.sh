#!/bin/sh
set -e

exec php artisan serve --host=0.0.0.0 --port=8000
