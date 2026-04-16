#!/bin/bash
set -e

echo "==> Initializing submodules..."
git submodule init
git submodule update

echo "==> Building tai-grid library..."
cd grid
npm install
npm run build
cd ..

echo "==> Installing PHP dependencies..."
composer install

echo "==> Setting up environment..."
if [ ! -f .env ]; then
  cp .env.example .env
  php artisan key:generate
else
  echo "    .env already exists, skipping key generation"
fi

echo "==> Running database migrations..."
php artisan migrate --seed

echo "==> Installing frontend dependencies..."
npm install

echo ""
echo "Setup complete. Run the app with:"
echo "  php artisan serve"
echo "  npm run dev"
