# Library Management System

A NestJS and Prisma-based Library Management System API.

## Schema Decisions

I decided that the `Book` model should reference the `Genre` model using a foreign key (`genreId`) instead of embedding the genre name directly inside the Book.

### Why?
- Prevents data duplication
- Makes it easy to update a genre name in one place
- Follows relational database best practices (normalization)
- Better data integrity

In document databases (like MongoDB), embedding is more common. But since we are using PostgreSQL, referencing is the correct approach.

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
