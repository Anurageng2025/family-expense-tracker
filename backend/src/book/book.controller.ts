import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ResponseUtil } from '../common/interfaces/api-response.interface';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BookController {
  constructor(private bookService: BookService) {}

  /**
   * POST /api/books
   * Create a new expense book
   */
  @Post()
  async createBook(@CurrentUser() user, @Body() dto: CreateBookDto) {
    try {
      const book = await this.bookService.createBook(user.familyId, dto);
      return ResponseUtil.success('Expense book created', book);
    } catch (error) {
      return ResponseUtil.error(error.message, error.stack, error.status);
    }
  }

  /**
   * GET /api/books
   * Get all books for the family
   */
  @Get()
  async getFamilyBooks(@CurrentUser() user) {
    try {
      const books = await this.bookService.getFamilyBooks(user.familyId);
      return ResponseUtil.success('Family expense books retrieved', books);
    } catch (error) {
      return ResponseUtil.error(error.message, error.stack, error.status);
    }
  }

  /**
   * GET /api/books/:id
   * Get a single book
   */
  @Get(':id')
  async getBook(@CurrentUser() user, @Param('id') bookId: string) {
    try {
      const book = await this.bookService.getBookById(bookId, user.familyId);
      return ResponseUtil.success('Expense book retrieved', book);
    } catch (error) {
      return ResponseUtil.error(error.message, error.stack, error.status);
    }
  }

  /**
   * PUT /api/books/:id
   * Update a book
   */
  @Put(':id')
  async updateBook(
    @CurrentUser() user,
    @Param('id') bookId: string,
    @Body() dto: UpdateBookDto,
  ) {
    try {
      const book = await this.bookService.updateBook(bookId, user.familyId, dto);
      return ResponseUtil.success('Expense book updated', book);
    } catch (error) {
      return ResponseUtil.error(error.message, error.stack, error.status);
    }
  }

  /**
   * DELETE /api/books/:id
   * Delete a book
   */
  @Delete(':id')
  async deleteBook(@CurrentUser() user, @Param('id') bookId: string) {
    try {
      const result = await this.bookService.deleteBook(bookId, user.familyId);
      return ResponseUtil.success(result.message);
    } catch (error) {
      return ResponseUtil.error(error.message, error.stack, error.status);
    }
  }
}
