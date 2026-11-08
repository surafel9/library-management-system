import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('seeding started');
  const fantasy = await prisma.genre.upsert({
    where: { name: 'Fantasy' },
    update: {},
    create: { name: 'Fantasy' },
  });
  const scifi = await prisma.genre.upsert({
    where: { name: 'Science Fiction' },
    update: {},
    create: { name: 'Science Fiction' },
  });
  const mystery = await prisma.genre.upsert({
    where: { name: 'Mystery' },
    update: {},
    create: { name: 'Mystery' },
  });
  const romance = await prisma.genre.upsert({
    where: { name: 'Romance' },
    update: {},
    create: { name: 'Romance' },
  });

  const books = [
    { title: 'ፍቅር እስከ መቃብር', genreId: romance.id },
    { title: 'Harry Potter', genreId: fantasy.id },
    { title: 'Name of the Wind', genreId: fantasy.id },
    { title: 'The Way of Kings', genreId: fantasy.id },
    { title: 'Dune', genreId: scifi.id },
    { title: 'Foundation', genreId: scifi.id },
    { title: 'Neuromancer', genreId: scifi.id },
    { title: 'The Martian', genreId: scifi.id },
    { title: 'Gone Girl', genreId: mystery.id },
    { title: 'Sherlock Holmes', genreId: mystery.id },
    { title: 'The Girl with the Dragon Tattoo', genreId: mystery.id },
    { title: 'Big Little Lies', genreId: mystery.id },
    { title: 'Pride and Prejudice', genreId: romance.id },
    { title: 'The Notebook', genreId: romance.id },
    { title: 'It Ends with Us', genreId: romance.id },
    { title: 'Me Before You', genreId: romance.id },
  ];

  for (const book of books) {
    const existingBook = await prisma.book.findFirst({
      where: { title: book.title, genreId: book.genreId },
    });
    if (!existingBook) {
      await prisma.book.create({ data: book });
    }
  }
  console.log('seeding Finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
