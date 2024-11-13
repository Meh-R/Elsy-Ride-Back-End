import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { creatProductDto, updateProductDto } from './dto';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private imageService: ImageService,
  ) {}

  async getAllProduct(page: number) {
    return this.prisma.product.findMany({
      orderBy: {
        created_at: 'desc',
      },
      // skip: page * 4,
      // take: 4,
      select: {
        id: true,
        name: true,
        picsProduct: true,
        description: true,
        price: true,
        stock: true,
        created_at: true,
        updated_at: true,
        categoryId: true,
        category: {
          select: {
            type: true,
          },
        },
      },
    });
  }

  async findProductByid(id: string) {
    return this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findProduct(query: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
        ],
      },
    });
  }

  async getProductsByCategoryType(type: string, page: number) {
    return this.prisma.product.findMany({
      // skip: page * 4,
      // take: 4,
      where: {
        category: {
          type: type,
        },
      },
      include: {
        category: true,
      },
    });
  }

  async createProduct(dto: creatProductDto) {
    return await this.prisma.product.create({
      data: {
        ...dto,
      },
    });
  }

  async updateProduct(id: string, dto: updateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingProduct) {
      throw new ForbiddenException('Product to update not found');
    }

    return await this.prisma.product.update({
      where: {
        id: id,
      },
      data: { ...dto },
    });
  }

  async deleteProduct(id: string) {
    const existingProduct = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingProduct) {
      throw new ForbiddenException('product to delete not found');
    }

    await this.prisma.cart_Has_Product.deleteMany({
      where: {
        productId: existingProduct.id,
      },
    });

    await this.imageService.deleteFile(existingProduct.picsProduct);

    await this.prisma.product.delete({
      where: {
        id: id,
      },
    });

    return 'Product deleted';
  }
}
