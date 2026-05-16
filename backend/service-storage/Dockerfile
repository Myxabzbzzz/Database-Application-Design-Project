FROM php:8.4-cli-alpine

RUN apk add --no-cache git unzip \
    && docker-php-ext-install pdo pdo_mysql

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views \
    && composer install --no-dev --optimize-autoloader --no-interaction

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]
