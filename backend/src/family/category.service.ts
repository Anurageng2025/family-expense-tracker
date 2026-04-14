import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryType } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all categories for a family
   */
  async getCategories(familyId: string) {
    return this.prisma.category.findMany({
      where: { familyId },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Create a new custom category
   */
  async createCategory(familyId: string, name: string, type: CategoryType) {
    // Check if category already exists for this family and type
    const existing = await this.prisma.category.findFirst({
      where: {
        familyId,
        name: { equals: name, mode: 'insensitive' },
        type,
      },
    });

    if (existing) {
      throw new BadRequestException(`Category "${name}" already exists for ${type.toLowerCase()} transactions`);
    }

    return this.prisma.category.create({
      data: {
        familyId,
        name,
        type,
      },
    });
  }

  /**
   * Delete a custom category
   */
  async deleteCategory(familyId: string, categoryId: string) {
    // Ensure category belongs to the family
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, familyId },
    });

    if (!category) {
      throw new BadRequestException('Category not found or access denied');
    }

    // Check if any transactions are using this category name
    // (We don't block deletion, but it's good to know)
    
    return this.prisma.category.delete({
      where: { id: categoryId },
    });
  }

  /**
   * Seed default categories for a new family
   */
  async seedDefaultCategories(familyId: string) {
    const defaults = [
      { name: 'Salary', type: CategoryType.INCOME },
      { name: 'Business', type: CategoryType.INCOME },
      { name: 'Gift', type: CategoryType.INCOME },
      { name: 'Investment', type: CategoryType.INCOME },
      { name: 'Other', type: CategoryType.INCOME },
      { name: 'Food', type: CategoryType.EXPENSE },
      { name: 'Transport', type: CategoryType.EXPENSE },
      { name: 'Shopping', type: CategoryType.EXPENSE },
      { name: 'Bills', type: CategoryType.EXPENSE },
      { name: 'Healthcare', type: CategoryType.EXPENSE },
      { name: 'Entertainment', type: CategoryType.EXPENSE },
      { name: 'Other', type: CategoryType.EXPENSE },
    ];

    return this.prisma.category.createMany({
      data: defaults.map(d => ({ ...d, familyId })),
    });
  }
}
