import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const genreNames = ['Fantasy', 'Science Fiction', 'Mystery', 'Biography'];
  const genres = await Promise.all(
    genreNames.map((name) =>
      prisma.genre.upsert({
        where: { name },
        update: {},
        create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') },
      }),
    ),
  );

  const sampleBooks = [
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy' },
    { title: 'Harry Potter', author: 'J.K. Rowling', genre: 'Fantasy' },
    { title: 'Name of the Wind', author: 'Patrick Rothfuss', genre: 'Fantasy' },
    { title: 'The Way of Kings', author: 'Brandon Sanderson', genre: 'Fantasy' },
    { title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction' },
    { title: 'Foundation', author: 'Isaac Asimov', genre: 'Science Fiction' },
    { title: 'Neuromancer', author: 'William Gibson', genre: 'Science Fiction' },
    { title: 'The Martian', author: 'Andy Weir', genre: 'Science Fiction' },
    { title: 'The Big Sleep', author: 'Raymond Chandler', genre: 'Mystery' },
    { title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Mystery' },
    { title: 'Sherlock Holmes', author: 'Arthur Conan Doyle', genre: 'Mystery' },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', genre: 'Mystery' },
    { title: 'Educated', author: 'Tara Westover', genre: 'Biography' },
    { title: 'Steve Jobs', author: 'Walter Isaacson', genre: 'Biography' },
    { title: 'Becoming', author: 'Michelle Obama', genre: 'Biography' },
    { title: 'Long Walk to Freedom', author: 'Nelson Mandela', genre: 'Biography' },
  ];

  for (const book of sampleBooks) {
    const genre = genres.find((g) => g.name === book.genre);
    if (!genre) continue;

    const existingBook = await prisma.book.findFirst({
      where: { title: book.title, author: book.author },
    });

    if (!existingBook) {
      await prisma.book.create({
        data: {
          title: book.title,
          author: book.author,
          isbn: `978${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          description: `${book.title} by ${book.author}.`,
          totalCopies: 3,
          availableCopies: 3,
          genreId: genre.id,
        },
      });
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
