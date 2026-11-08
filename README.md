# Library Management System

A NestJS and Prisma-based Library Management System API.

## Schema Decisions

Book references Genre via a genreId foreign key rather than embedding the
genre name directly, because many books share one genre and genres are
managed independently (renaming a genre should not require updating every
book). User stores a `role` field using a Role enum so Postgres and
TypeScript both reject any value other than PATRON or LIBRARIAN.

## Setup and Installation

```bash
npm install
```

## Database Migration & Seeding

```bash
npx prisma migrate dev
npx prisma db seed
```

## Running the Application

```bash
# development
npm run start:dev

# production mode
npm run start:prod
```
