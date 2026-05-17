# E-Commerce Platform - Database Application Design Project

> A 3rd year study project demonstrating microservices architecture, database design, and distributed systems principles.

[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Laravel](https://img.shields.io/badge/Laravel-11.x-red.svg)](https://laravel.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)

---

## Quick Start

### Prerequisites

- Docker and Docker Compose installed

### One-Command Run

```bash
# 1. Clone the repository
git clone <repository-url>
cd Database-Application-Design-Project

# 2. Copy and configure environment variables
cp .env.example .env
# Edit .env and fill in required values (see Environment Variables section below)

# 3. Start everything
docker-compose up -d

# 4. Wait for services to be healthy (~60 seconds)
docker-compose ps

# 5. Access the application
# Frontend: http://localhost
# API Gateway: http://localhost/api
# MinIO Console: http://localhost:9001 (minioadmin/minioadmin)
```

The application will automatically:
- Create 4 separate PostgreSQL databases
- Run all migrations
- Configure MinIO storage
- Start scheduled tasks

---

## Architecture Overview

### Microservices Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
└──────────────────────┬──────────────────────────────────┘
│ HTTP :80
┌──────────────────────▼──────────────────────────────────┐
│                   NGINX API GATEWAY                      │
│  /              → frontend static files                  │
│  /api/auth/     → service-auth:8000                      │
│  /api/products/ → service-product:8000                   │
│  /api/payments/ → service-payment:8000                   │
│  /api/storage/  → service-storage:8000                   │
│  /storage/      → minio:9000 (public read)               │
└──┬───────────┬────────────┬──────────────┬──────────────┘
│           │            │              │
┌──▼──┐  ┌────▼────┐  ┌────▼────┐  ┌─────▼──────┐
│auth │  │product  │  │payment  │  │  storage   │
│:8001│  │  :8004  │  │  :8003  │  │   :8005    │
└──┬──┘  └────┬────┘  └────┬────┘  └─────┬──────┘
│          │            │             │
└──────────┴────────────┴─────────────┘
│
┌────────────┼────────────┐
│            │            │
┌────▼───┐  ┌─────▼──┐  ┌────▼───┐
│auth_db │  │prod_db │  │pay_db  │
│:5432   │  │:5432   │  │:5432   │
└────────┘  └────────┘  └────────┘
│
┌────▼────┐    ┌──────────┐
│  Redis  │    │  MinIO   │
│  :6379  │    │  :9000   │
└─────────┘    └──────────┘
```

### Services

| Service | Port | Technology | Purpose |
|---------|------|------------|---------|
| **nginx** | 80 | Nginx | API Gateway + Frontend |
| **service-auth** | 8001 | Laravel 11 + Porto | Authentication, JWT |
| **service-product** | 8004 | Laravel 11 + Porto | Products, orders, carts |
| **service-payment** | 8003 | Laravel 11 | Stripe integration |
| **service-storage** | 8005 | Laravel 11 | File uploads (MinIO) |
| **postgres** | 5432 | PostgreSQL 16 | 4 databases |
| **redis** | 6379 | Redis 7 | Cache, queue |
| **minio** | 9000/9001 | MinIO | S3 storage |

### Key Features

- **Porto Architecture** (service-auth, service-product)
- **JWT Authentication** with refresh tokens
- **Database per Service** pattern
- **Redis caching** and queue system
- **4 Automated cron jobs** (user cleanup, order cancellation, cart reminders, login protection)
- **IP-based brute force protection**
- **Transaction-based operations** with rollback

---

## Environment Variables Reference

Copy `.env.example` to `.env` and configure:

### 1. Database (Required)

```bash
DB_USERNAME=postgres
DB_PASSWORD=secret            # Change in production!
```

### 2. Laravel App Keys (Required)

Generate with `php artisan key:generate --show` in each service:

```bash
cd backend/service-auth && php artisan key:generate --show
cd backend/service-product && php artisan key:generate --show
cd backend/service-payment && php artisan key:generate --show
cd backend/service-storage && php artisan key:generate --show
```

Add to `.env`:
```bash
AUTH_APP_KEY=base64:...
PRODUCT_APP_KEY=base64:...
PAYMENT_APP_KEY=base64:...
STORAGE_APP_KEY=base64:...
```

### 3. JWT Secret (Required)

```bash
cd backend/service-auth
composer install
php artisan jwt:secret --show
```

Add to `.env`:
```bash
JWT_SECRET=...
```

### 4. Internal Service Token (Required)

```bash
openssl rand -base64 32
```

Add to `.env`:
```bash
INTERNAL_TOKEN=...
```

### 5. Gmail App Password (Required)

1. Enable 2FA in Google Account
2. Generate App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

Add to `.env`:
```bash
GMAIL_APP_PASSWORD=...        # 16-character password
```

### 6. MinIO (Optional - defaults OK for dev)

```bash
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
MINIO_BUCKET=storage
```

### 7. Stripe (Optional)

Get keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys):

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Variables Summary

| Variable | Required | Purpose |
|----------|----------|---------|
| `DB_USERNAME`, `DB_PASSWORD` | ✅ Yes | PostgreSQL credentials |
| `*_APP_KEY` (4 services) | ✅ Yes | Laravel encryption |
| `JWT_SECRET` | ✅ Yes | JWT token signing |
| `INTERNAL_TOKEN` | ✅ Yes | Inter-service auth |
| `GMAIL_APP_PASSWORD` | ✅ Yes | Email sending |
| `MINIO_*` | ❌ No | Defaults work for dev |
| `STRIPE_*` | ❌ No | Only if using payments |

---

## Change Guide for Contributors

### Making Changes

**1. Fork and Setup**
```bash
git clone <your-fork-url>
cd Database-Application-Design-Project
cp .env.example .env
# Fill in required variables
docker-compose up -d
```

**2. Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

**3. Choose Service**
- User/Auth → `service-auth`
- Products/Orders/Carts → `service-product`
- Payments → `service-payment`
- File uploads → `service-storage`

**4. Database Changes (Always use migrations!)**
```bash
# Create migration
docker-compose exec service-product php artisan make:migration add_field_to_table

# Run migration
docker-compose exec service-product php artisan migrate

# If error: rollback, fix, run again
docker-compose exec service-product php artisan migrate:rollback
```

**5. Write Tests**
```bash
docker-compose exec service-auth php artisan test
```

**6. Commit**
```bash
# Format: type: brief description
git commit -m "feat: add user profile update endpoint"
git commit -m "fix: resolve stock not updating on order cancel"
```

**Commit types:** `feat:` (new feature), `fix:` (bug fix), `refactor:` (code refactor), `docs:` (documentation), `test:` (tests)

**7. Push and Create PR**
```bash
git push origin feature/your-feature-name
# Create Pull Request on GitHub
```

### Code Standards

- **PSR-12** coding standard
- **Type hints** for all parameters and return types
- **Meaningful names** (no `$x`, `$data`, `$temp`)
- **Porto Architecture** for service-auth and service-product

**Example:**
```php
public function register(RegisterRequest $request): JsonResponse
{
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
    ]);

    return response()->json(['user' => $user], 201);
}
```

### Adding Cron Jobs

**1. Create Command**
```bash
docker-compose exec service-product php artisan make:command YourCommand
```

**2. Add to Scheduler** (`bootstrap/app.php`)
```php
$schedule->command('your:command')
    ->daily()
    ->at('10:00')
    ->withoutOverlapping(10)
    ->runInBackground()
    ->appendOutputTo(storage_path('logs/your-command.log'));
```


## Tech Stack

- **Backend:** Laravel 11, PHP 8.2+
- **Architecture:** Porto (Modular Monolith)
- **Database:** PostgreSQL 16
- **Cache/Queue:** Redis 7
- **Storage:** MinIO (S3-compatible)
- **Authentication:** JWT (tymon/jwt-auth)
- **Payments:** Stripe
- **API Gateway:** Nginx
- **Containerization:** Docker, Docker Compose

---