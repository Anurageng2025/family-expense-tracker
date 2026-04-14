import { Module } from '@nestjs/common';
import { FamilyController } from './family.controller';
import { CategoryController } from './category.controller';
import { FamilyService } from './family.service';
import { CategoryService } from './category.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FamilyController, CategoryController],
  providers: [FamilyService, CategoryService],
  exports: [CategoryService],
})
export class FamilyModule {}
