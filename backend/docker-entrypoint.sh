#!/bin/sh
set -e

cd /var/www/html

if [ ! -f .env ]; then
  echo "[backend] Creating .env from .env.example..."
  cp .env.example .env
fi

LOCK_HASH=""
if [ -f composer.lock ]; then
  LOCK_HASH=$(sha256sum composer.lock | awk '{print $1}')
fi

INSTALLED_HASH=""
if [ -f vendor/.composer.lock.sha256 ]; then
  INSTALLED_HASH=$(cat vendor/.composer.lock.sha256)
fi

if [ ! -f vendor/autoload.php ] || [ "$LOCK_HASH" != "$INSTALLED_HASH" ]; then
  echo "[backend] Syncing Composer dependencies..."
  composer install --no-interaction --no-scripts --prefer-dist
  if [ -n "$LOCK_HASH" ]; then
    printf "%s\n" "$LOCK_HASH" > vendor/.composer.lock.sha256
  fi
fi

if ! grep -qE '^APP_KEY=base64:.+' .env; then
  echo "[backend] Generating APP_KEY..."
  php artisan key:generate --force --ansi
fi

echo "[backend] Refreshing Laravel caches & package discovery..."
php artisan config:clear --ansi
php artisan route:clear --ansi
php artisan package:discover --ansi

if [ ! -e public/storage ] || [ ! -d public/storage ]; then
  echo "[backend] Creating relative public/storage symlink..."
  rm -rf public/storage
  ln -sfn ../storage/app/public public/storage
fi

echo "[backend] Waiting for MySQL (${DB_HOST:-db}:${DB_PORT:-3306})..."
MAX_RETRIES=30
ATTEMPT=0
until php -r '
  try {
    new PDO(
      "mysql:host=" . getenv("DB_HOST") . ";port=" . (getenv("DB_PORT") ?: 3306) . ";dbname=" . getenv("DB_DATABASE"),
      getenv("DB_USERNAME"),
      getenv("DB_PASSWORD")
    );
    exit(0);
  } catch (Throwable $e) {
    exit(1);
  }
' 2>/dev/null; do
  ATTEMPT=$((ATTEMPT + 1))
  if [ "$ATTEMPT" -ge "$MAX_RETRIES" ]; then
    echo "[backend] ERROR: Could not connect to MySQL after ${MAX_RETRIES} attempts." >&2
    exit 1
  fi
  sleep 2
done

echo "[backend] Running migrations..."
php artisan migrate --force --ansi

USER_COUNT=$(php -r '
  require "vendor/autoload.php";
  $app = require "bootstrap/app.php";
  $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
  echo App\Models\User::count();
')

if [ "$USER_COUNT" = "0" ]; then
  echo "[backend] Database empty — seeding demo accounts & recommendations..."
  php artisan db:seed --force --ansi
fi

echo "[backend] Starting Laravel dev server on 0.0.0.0:8000..."
cd /var/www/html/public
exec php -S 0.0.0.0:8000 /var/www/html/vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php
