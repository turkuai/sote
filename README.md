# sote

## Requirements

- PHP >= 8.2
- Composer
- Node.js >= 18
- SQLite (included in PHP by default)

## Setup

### 1. Submodule Setup

If you are using a submodule, make sure to initialize and update it before proceeding:

```bash
# Initialize and update submodules
git submodule init
git submodule update

# If you need to make changes to the submodule and push them
git add .
git commit -m "Submodule update"
git push origin main
```

### 2. tai-grid library
```bash

cd phptest/tai-grid
npm install
npm run build
```

### 3. Backend (Laravel)
```bash
cd phptest/app
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

### 4. Frontend
```bash
cd phptest/app
npm install
```

## Running the app

From `phptest/app`, in two terminals:

```bash
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - frontend build
npm run dev
```

Open in browser: http://localhost:8000

## Test users

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | Admin |
| jane@example.com | password123 | Manager |
| bob@example.com | password123 | Nurse |

