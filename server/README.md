# sote

## Setup Instructions for Laravel App

After pulling this code, follow these steps to run the project locally:

### 1. Install Dependencies

```bash
npm install
composer install
```

### 2. Create .env File

Copy the example file:
```bash
copy .env.example .env
```

Or on Mac/Linux:
```bash
cp .env.example .env
```

### 3. Generate App Key

```bash
php artisan key:generate
```

### 4. Create Database

```bash
New-Item -ItemType File -Path "database\database.sqlite" -Force
```

Or on Mac/Linux:
```bash
touch database/database.sqlite
```

### 5. Run Migrations

```bash
php artisan migrate
```

### 6. Start Development Server

```bash
composer run dev
```

The app will be available at: **http://127.0.0.1:8000**

## Troubleshooting

- If you get "vite not found" error, run `npm install` again
- If database migration fails, make sure database/database.sqlite file exists
- If you see encryption key errors, run `php artisan key:generate`