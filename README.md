# sote

## Requirements

- PHP >= 8.2
- Composer
- Node.js >= 18
- SQLite (included in PHP by default)

## Setup

### 1. tai-grid library
```bash
cd phptest/tai-grid
npm install
npm run build
```

### 2. Backend (Laravel)
```bash
cd phptest/app
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

### 3. Frontend
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
 
