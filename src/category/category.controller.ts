import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtGuard } from '../auth/Guards';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { createCategoryDto } from './dto/create.category.dto';
import { updateCategoryDto } from './dto';
import { AdminGuard } from '../auth/Guards/auth.guard';

@UseGuards(JwtGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/all/:page')
  getAllCategory(@Param('page') page: number) {
    return this.categoryService.getAllCategory(page);
  }

  @Get('/find/:query')
  findCategory(@Param('query') query: string) {
    return this.categoryService.findCategory(query);
  }

  @UseGuards(AdminGuard)
  @Post('/create')
  createCategory(@Body() dto: createCategoryDto) {
    return this.categoryService.createCategory(dto);
  }

  @UseGuards(AdminGuard)
  @Patch('/update/:id')
  updateCategory(@Param('id') id: string, @Body() dto: updateCategoryDto) {
    return this.categoryService.updateCategory(id, dto);
  }

  @UseGuards(AdminGuard)
  @Delete('/delete/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
