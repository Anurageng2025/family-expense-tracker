import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new expense record
   */
  async createExpense(userId: string, dto: CreateExpenseDto) {
    let bookId = dto.bookId;

    // If no bookId provided, find the default book for the user's family
    if (!bookId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { familyId: true },
      });

      const defaultBook = await this.prisma.book.findFirst({
        where: { familyId: user.familyId, isDefault: true },
      });

      if (!defaultBook) {
        // Create a default book if it doesn't exist
        const newDefault = await this.prisma.book.create({
          data: {
            familyId: user.familyId,
            name: 'Ongoing',
            isDefault: true,
          },
        });
        bookId = newDefault.id;
      } else {
        bookId = defaultBook.id;
      }
    }

    const expense = await this.prisma.expense.create({
      data: {
        userId,
        bookId,
        amount: dto.amount,
        category: dto.category,
        date: new Date(dto.date),
        notes: dto.notes,
      },
    });

    return expense;
  }

  /**
   * Get all expenses for a user, optionally filtered by book
   */
  async getUserExpenses(userId: string, bookId?: string) {
    const expenses = await this.prisma.expense.findMany({
      where: { 
        userId,
        ...(bookId && { bookId })
      },
      orderBy: { date: 'desc' },
    });

    return expenses;
  }

  /**
   * Get all expenses for a family, optionally filtered by book
   */
  async getFamilyExpenses(familyId: string, bookId?: string) {
    const expenses = await this.prisma.expense.findMany({
      where: {
        user: {
          familyId,
        },
        ...(bookId && { bookId })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    return expenses;
  }

  /**
   * Get a single expense by ID
   */
  async getExpenseById(expenseId: string, userId: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id: expenseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!expense) {
      throw new NotFoundException('Expense record not found');
    }

    // Check if user owns this expense
    if (expense.userId !== userId) {
      throw new ForbiddenException('You can only view your own expense records');
    }

    return expense;
  }

  /**
   * Update an expense record
   */
  async updateExpense(expenseId: string, userId: string, dto: UpdateExpenseDto) {
    const expense = await this.prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense) {
      throw new NotFoundException('Expense record not found');
    }

    if (expense.userId !== userId) {
      throw new ForbiddenException('You can only update your own expense records');
    }

    const updated = await this.prisma.expense.update({
      where: { id: expenseId },
      data: {
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.category && { category: dto.category }),
        ...(dto.date && { date: new Date(dto.date) }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });

    return updated;
  }

  /**
   * Delete an expense record
   */
  async deleteExpense(expenseId: string, userId: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense) {
      throw new NotFoundException('Expense record not found');
    }

    if (expense.userId !== userId) {
      throw new ForbiddenException('You can only delete your own expense records');
    }

    await this.prisma.expense.delete({
      where: { id: expenseId },
    });

    return { message: 'Expense record deleted successfully' };
  }

  /**
   * Get expense statistics for a user
   */
  async getUserExpenseStats(userId: string) {
    const expenses = await this.prisma.expense.findMany({
      where: { userId },
    });

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const byCategory = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {});

    return {
      total,
      count: expenses.length,
      byCategory,
    };
  }
}

