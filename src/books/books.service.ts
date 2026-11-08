import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';
import { QueryBooksDto } from './dto/query-books.dto.js';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    const genre = await this.prisma.genre.findUnique({
      where: { id: createBookDto.genreId },
    });
    if (!genre) {
      throw new NotFoundException(
        `Genre with ID ${createBookDto.genreId} not found`,
      );
    }

    return this.prisma.book.create({
      data: {
        ...createBookDto,
        availableCopies: createBookDto.totalCopies ?? 1,
      },
      include: { genre: true },
    });
  }

  async findAll(query: QueryBooksDto) {
    const { genreId, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BookWhereInput = {};

    if (genreId) {
      where.genreId = Number(genreId);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, books] = await Promise.all([
      this.prisma.book.count({ where }),
      this.prisma.book.findMany({
        where,
        skip,
        take: Number(limit),
        include: { genre: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: books,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);
    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
      include: { genre: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
