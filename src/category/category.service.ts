import { ForbiddenException, Injectable } from '@nestjs/common';
import { Category, User } from '@prisma/client';
import { dot } from 'node:test/reporters';
import { PrismaService } from 'src/prisma/prisma.service';
import { createCategoryDto } from './dto/create.category.dto';
import { updateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllCategory(page: number) {
    const offset = page * 1;
    return this.prisma.$queryRawUnsafe(
      `SELECT id, type, picsCategory, created_at, updated_at
       FROM Category
       ORDER BY type DESC
       LIMIT 100  OFFSET ?`,
      offset,
    );
  }

  async findCategory(query: string) {
    const searchTerm = `%${query}%`;
    return this.prisma.$queryRawUnsafe(
      `SELECT * FROM Category
       WHERE type LIKE ?`,
      searchTerm,
    );
  }

  async createCategory(dto: createCategoryDto) {
    const { type, picsCategory } = dto;
    await this.prisma.$executeRawUnsafe(
      `INSERT INTO Category (id, type, picsCategory, created_at, updated_at)
       VALUES (UUID(), ?, ?, NOW(), NOW())`,
      type,
      picsCategory,
    );
    return { message: 'Category created successfully' };
  }

  async updateCategory(id: string, dto: updateCategoryDto) {
    const existingCategory = await this.prisma.$queryRawUnsafe(
      `SELECT * FROM Category WHERE id = ?`,
      id,
    );

    if (!existingCategory) {
      throw new ForbiddenException('Category to update not found');
    }

    const updates = [];
    const params = [];

    if (dto.type) {
      updates.push('type = ?');
      params.push(dto.type);
    }

    if (dto.picsCategory) {
      updates.push('picsCategory = ?');
      params.push(dto.picsCategory);
    }

    updates.push('updated_at = NOW()');
    params.push(id);

    const sqlQuery = `
      UPDATE Category
      SET ${updates.join(', ')}
      WHERE id = ?
    `;
    await this.prisma.$executeRawUnsafe(sqlQuery, ...params);

    return { message: 'Category updated successfully' };
  }

  async deleteCategory(id: string) {
    const existingCategory = await this.prisma.$queryRawUnsafe(
      `SELECT * FROM Category WHERE id = ?`,
      id,
    );

    if (!existingCategory) {
      throw new ForbiddenException('Category to delete not found');
    }

    await this.prisma.$executeRawUnsafe(
      `DELETE chp
       FROM Cart_Has_Product chp
       JOIN Product p ON chp.productId = p.id
       WHERE p.categoryId = ?`,
      id,
    );

    await this.prisma.$executeRawUnsafe(
      `DELETE FROM Product WHERE categoryId = ?`,
      id,
    );

    await this.prisma.$executeRawUnsafe(
      `DELETE FROM Category WHERE id = ?`,
      id,
    );

    return { message: 'Category deleted successfully' };
  }
}
