# Capstone1Dashboard

This repository contains the Capstone dashboard and survey application built with Laravel 12, Blade, and Vite.

## Demo setup (Windows / PowerShell)

1. Install prerequisites:
	- PHP 8.2+
	- Composer 2+
	- Node.js 20+
	- npm 10+

2. Open a terminal in the project root and run:

```powershell
composer install
npm install
```

3. Create environment and database files:

```powershell
Copy-Item .env.example .env
if (!(Test-Path "database\database.sqlite")) { New-Item -ItemType File -Path "database\database.sqlite" | Out-Null }
```

4. Initialize app key, schema, and seed data:

```powershell
php artisan key:generate
php artisan migrate --seed --force
```

5. Build front-end assets (optional for dev mode, recommended for demo stability):

```powershell
npm run build
```

## Run for live demo

Use one terminal:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

If you will edit JS/CSS during demo, use a second terminal:

```powershell
npm run dev
```

## One-Command Demo

From the repository root, run:

```powershell
npm run demo
```

This starts the backend app on http://127.0.0.1:8000 and the root app on http://127.0.0.1:8001.

## Demo URLs

- Landing page: http://127.0.0.1:8000/
- Survey form: http://127.0.0.1:8000/survey
- Admin panel: http://127.0.0.1:8000/admin
- Career post form: http://127.0.0.1:8000/career-opportunities/post

## Seeded demo users

- Admin: admin@test.com / password123
- User: user@test.com / password123

## Verified status

The following were verified locally:

- Dependencies installed successfully via Composer and npm
- Migrations and seeders completed successfully
- Assets built successfully with Vite
- HTTP 200 responses confirmed for /, /survey, and /admin