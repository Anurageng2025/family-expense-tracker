import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto, UpdateIncomeDto } from './dto/income.dto';

@Injectable()
export class IncomeService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new income record
   */
  async createIncome(userId: string, dto: CreateIncomeDto) {
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

    const income = await this.prisma.income.create({
      data: {
        userId,
        bookId,
        amount: dto.amount,
        category: dto.category,
        date: new Date(dto.date),
        notes: dto.notes,
      },
    });

    return income;
  }

  /**
   * Get all incomes for a user, optionally filtered by book
   */
  async getUserIncomes(userId: string, bookId?: string) {
    const incomes = await this.prisma.income.findMany({
      where: { 
        userId,
        ...(bookId && { bookId })
      },
      orderBy: { date: 'desc' },
    });

    return incomes;
  }

  /**
   * Get all incomes for a family, optionally filtered by book
   */
  async getFamilyIncomes(familyId: string, bookId?: string) {
    const incomes = await this.prisma.income.findMany({
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

    return incomes;
  }

  /**
   * Get a single income by ID
   */
  async getIncomeById(incomeId: string, userId: string) {
    const income = await this.prisma.income.findUnique({
      where: { id: incomeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!income) {
      throw new NotFoundException('Income record not found');
    }

    // Check if user owns this income
    if (income.userId !== userId) {
      throw new ForbiddenException('You can only view your own income records');
    }

    return income;
  }

  /**
   * Update an income record
   */
  async updateIncome(incomeId: string, userId: string, dto: UpdateIncomeDto) {
    const income = await this.prisma.income.findUnique({
      where: { id: incomeId },
    });

    if (!income) {
      throw new NotFoundException('Income record not found');
    }

    if (income.userId !== userId) {
      throw new ForbiddenException('You can only update your own income records');
    }

    const updated = await this.prisma.income.update({
      where: { id: incomeId },
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
   * Delete an income record
   */
  async deleteIncome(incomeId: string, userId: string) {
    const income = await this.prisma.income.findUnique({
      where: { id: incomeId },
    });

    if (!income) {
      throw new NotFoundException('Income record not found');
    }

    if (income.userId !== userId) {
      throw new ForbiddenException('You can only delete your own income records');
    }

    await this.prisma.income.delete({
      where: { id: incomeId },
    });

    return { message: 'Income record deleted successfully' };
  }

  /**
   * Get income statistics for a user
   */
  async getUserIncomeStats(userId: string) {
    const incomes = await this.prisma.income.findMany({
      where: { userId },
    });

    const total = incomes.reduce((sum, income) => sum + income.amount, 0);

    const byCategory = incomes.reduce((acc, income) => {
      if (!acc[income.category]) {
        acc[income.category] = 0;
      }
      acc[income.category] += income.amount;
      return acc;
    }, {});

    return {
      total,
      count: incomes.length,
      byCategory,
    };
  }
}

