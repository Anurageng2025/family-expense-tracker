import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ResponseUtil } from '../common/interfaces/api-response.interface';
import { CategoryType } from '@prisma/client';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async getCategories(@CurrentUser() user) {
    try {
      const categories = await this.categoryService.getCategories(user.familyId);
      return ResponseUtil.success('Categories fetched', categories);
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  @Post()
  async createCategory(
    @CurrentUser() user,
    @Body() body: { name: string; type: CategoryType }
  ) {
    try {
      const category = await this.categoryService.createCategory(
        user.familyId,
        body.name,
        body.type
      );
      return ResponseUtil.success('Category created', category);
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  @Delete(':id')
  async deleteCategory(@CurrentUser() user, @Param('id') id: string) {
    try {
      await this.categoryService.deleteCategory(user.familyId, id);
      return ResponseUtil.success('Category deleted');
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }
}
