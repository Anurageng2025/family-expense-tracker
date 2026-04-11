import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new expense book for a family
   */
  async createBook(familyId: string, dto: CreateBookDto) {
    // If this is the first book for the family, make it default
    const bookCount = await this.prisma.book.count({
      where: { familyId },
    });

    const isDefault = bookCount === 0 ? true : !!dto.isDefault;

    // If setting as default, unset other defaults for this family
    if (isDefault) {
      await this.prisma.book.updateMany({
        where: { familyId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const book = await this.prisma.book.create({
      data: {
        familyId,
        name: dto.name,
        isDefault,
      },
    });

    return book;
  }

  /**
   * Get all books for a family
   */
  async getFamilyBooks(familyId: string) {
    const books = await this.prisma.book.findMany({
      where: { familyId },
      orderBy: { createdAt: 'asc' },
    });

    // If no books exist, create a default one (Ongoing)
    if (books.length === 0) {
      const defaultBook = await this.prisma.book.create({
        data: {
          familyId,
          name: 'Ongoing',
          isDefault: true,
        },
      });
      return [defaultBook];
    }

    return books;
  }

  /**
   * Get a single book by ID
   */
  async getBookById(bookId: string, familyId: string) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.familyId !== familyId) {
      throw new ForbiddenException('You do not have access to this book');
    }

    return book;
  }

  /**
   * Update a book
   */
  async updateBook(bookId: string, familyId: string, dto: UpdateBookDto) {
    const book = await this.getBookById(bookId, familyId);

    if (dto.isDefault === true) {
      await this.prisma.book.updateMany({
        where: { familyId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updated = await this.prisma.book.update({
      where: { id: bookId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
      },
    });

    return updated;
  }

  /**
   * Delete a book
   */
  async deleteBook(bookId: string, familyId: string) {
    const book = await this.getBookById(bookId, familyId);

    if (book.isDefault) {
      throw new ForbiddenException('The default book cannot be deleted');
    }

    await this.prisma.book.delete({
      where: { id: bookId },
    });

    return { message: 'Book deleted successfully' };
  }
}
