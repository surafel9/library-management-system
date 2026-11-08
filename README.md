# Library Management System

A robust, production-ready NestJS and Prisma-based backend API for a Library Management System, featuring full catalog management, secure JWT authentication, role-based access control, and rate limiting.

---

## Schema Decisions

Book references Genre via a genreId foreign key rather than embedding the
genre name directly, because many books share one genre and genres are
managed independently (renaming a genre should not require updating every
book). User stores a `role` field using a Role enum so Postgres and
TypeScript both reject any value other than PATRON or LIBRARIAN.

### Architectural Rationale
- **Normalization (3NF):** Eliminates repetitive data and guarantees that a genre name or slug update is performed once without cascading record modifications.
- **Relational Integrity:** PostgreSQL foreign key constraints ensure that orphaned book records cannot exist without a valid genre relation.
- **Type Safety:** The `Role` enum is enforced at both the PostgreSQL database level and runtime via TypeScript / class-validator.

---

## Project Structure

```text
library-management-system/
├── api/                             # Dedicated API application directory (mirrored at root)
│   ├── prisma/
│   │   ├── migrations/              # Migration history & SQL scripts
│   │   ├── schema.prisma            # Prisma schema (Role enum, User, Genre, Book)
│   │   └── seed.ts                  # Database seeder (4 genres + 16 books)
│   ├── src/
│   │   ├── auth/                    # Authentication & Authorization
│   │   │   ├── dto/                 # RegisterDto, LoginDto
│   │   │   ├── auth.controller.ts   # POST /auth/register, POST /auth/login (Throttled)
│   │   │   ├── auth.service.ts      # Bcrypt hashing (10 salt rounds) & JWT token issuing
│   │   │   ├── jwt.strategy.ts      # Passport JWT strategy verifying JWT_SECRET
│   │   │   ├── jwt-auth.guard.ts    # Guard extending AuthGuard('jwt')
│   │   │   ├── roles.decorator.ts   # @Roles() decorator for RBAC
│   │   │   └── roles.guard.ts       # RolesGuard checking req.user.role against required roles
│   │   ├── books/                   # Book catalog management
│   │   │   ├── dto/                 # CreateBookDto, UpdateBookDto, QueryBooksDto
│   │   │   ├── books.controller.ts  # Filtering, search, pagination & guarded write routes
│   │   │   └── books.service.ts     # Dynamic Prisma where query, skip/take pagination
│   │   ├── genres/                  # Genre management
│   │   │   ├── dto/                 # CreateGenreDto, UpdateGenreDto
│   │   │   ├── genres.controller.ts # Full CRUD endpoints (GET, POST, PATCH, DELETE)
│   │   │   └── genres.service.ts    # Genre service with book relation counting
│   │   ├── users/                   # User profile management
│   │   │   └── users.controller.ts  # GET /users/profile using @Req() & JwtAuthGuard
│   │   ├── prisma/
│   │   │   ├── prisma.service.ts    # PrismaClient lifecycle connection service
│   │   │   └── prisma.module.ts     # Global database module
│   │   ├── app.module.ts            # Root module with ThrottlerModule rate limiting
│   │   └── main.ts                  # Bootstrap with ValidationPipe(whitelist: true) & CORS
│   └── .env.example                 # Environment configuration template
├── docs/
│   └── postman_collection.json      # Complete Postman collection for all endpoints
├── .env.example                     # Root environment configuration template
└── README.md                        # Documentation & schema explanation
```

---

## Features & Implementation Details

### 1. Authentication & Security
- **Endpoints:** `POST /auth/register` & `POST /auth/login`
- **Password Security:** Passwords hashed with `bcrypt` (10 salt rounds) before persistence.
- **JWT Authentication:** Issues signed JWT tokens verified using `JwtStrategy` and `JwtAuthGuard`.
- **Role-Based Access Control (RBAC):** Custom `@Roles()` decorator and `RolesGuard` restrict book creation, modification, and deletion exclusively to `LIBRARIAN` users.
- **Rate Limiting:** `ThrottlerGuard` protects sensitive routes (e.g. login) against brute-force attacks.

### 2. Catalog & Querying
- **Full Genre CRUD:** Complete Create, Read All, Read One, Update, and Delete endpoints at `/genres`.
- **Books Search & Filtering:** `GET /books` supports:
  - Filtering by `genreId`
  - Case-insensitive search on `title` and `author`
  - Pagination using `page` and `limit` with computed metadata (`total`, `totalPages`)
- **DTO Validation:** Global `ValidationPipe` with `whitelist: true` strips non-whitelisted payload properties and enforces strict types via `class-validator`.

---

## Setup & Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/surafel9/library-management-system.git
cd library-management-system
npm install
```

### 2. Environment Configuration
Copy the example environment file and configure your PostgreSQL connection:
```bash
cp .env.example .env
```
Update `.env` with your database credentials and JWT secret:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/library_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
```

### 3. Database Migration & Seeding
```bash
# Run database migrations
npx prisma migrate dev

# Seed database with genres and books
npx prisma db seed
```

### 4. Running the Application
```bash
# Development (with hot-reload)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

---

## API Testing with Postman

Import `docs/postman_collection.json` into Postman to test all endpoints:
1. **Auth:** Register and Login as Patron or Librarian (auto-saves `accessToken`).
2. **Users:** Fetch profile via `GET /users/profile`.
3. **Genres:** Full CRUD operations on `/genres`.
4. **Books:** Search, filter, and paginate `/books`, plus guarded write routes (`POST`, `PATCH`, `DELETE`).
