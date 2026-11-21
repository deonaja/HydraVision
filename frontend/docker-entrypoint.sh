#!/bin/sh
set -e

cd /app

LOCK_HASH=""
if [ -f package-lock.json ]; then
  LOCK_HASH=$(sha256sum package-lock.json | awk '{print $1}')
fi

INSTALLED_HASH=""
if [ -f node_modules/.package-lock.sha256 ]; then
  INSTALLED_HASH=$(cat node_modules/.package-lock.sha256)
fi

if [ ! -d node_modules/vite ] || [ "$LOCK_HASH" != "$INSTALLED_HASH" ]; then
  echo "[frontend] Syncing npm dependencies..."
  npm ci
  if [ -n "$LOCK_HASH" ]; then
    printf "%s\n" "$LOCK_HASH" > node_modules/.package-lock.sha256
  fi
fi

echo "[frontend] Starting Vite dev server on 0.0.0.0:5173..."
exec npm run dev -- --host 0.0.0.0 --port 5173
