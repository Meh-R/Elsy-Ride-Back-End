import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createCategoryDto } from 'src/category/dto/create.category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { cartHasProductDto, creatProductDto, updateProductDto } from './dto';
import { Prisma, User } from '@prisma/client';
import { ImageService } from 'src/image/image.service';
import { updatCartHasProductDto } from './dto/updateCartHasProduct.dto';

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

  async createCartHasProduct(user: User, id: string, dto: cartHasProductDto) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!cart) {
      throw new ForbiddenException('Cart not found');
    }

    const product = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product || product.stock < dto.quantity) {
      throw new ForbiddenException('Not enough stock');
    }

    const existingCartProduct = await this.prisma.cart_Has_Product.findFirst({
      where: {
        cartId: cart.id,
        productId: id,
        isActive: true,
      },
    });

    if (existingCartProduct) {
      throw new ForbiddenException('Product already exists in cart as active');
    }

    return await this.prisma.cart_Has_Product.create({
      data: {
        cartId: cart.id,
        productId: id,
        quantity: dto.quantity,
        isActive: true,
      },
    });
  }

  async getMyCartHasProduct(user: User) {
    const userVerif = await this.prisma.user.findMany({
      where: {
        id: user.id,
      },
      include: {
        cart: true,
      },
    });
    if (!userVerif) {
      throw new ForbiddenException('user does not exist');
    }

    const findCart = await this.prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
    });

    const findCartHasProduct = await this.prisma.cart_Has_Product.findMany({
      where: {
        cartId: findCart.id,
      },
      include: {
        product: true,
        cart: true,
      },
    });

    return { user: userVerif, cartHasProduct: findCartHasProduct };
  }

  async updateCartHasProduct(
    user: User,
    id: string,
    dto: updatCartHasProductDto,
  ) {
    const userVerif = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!userVerif) {
      throw new ForbiddenException('user does not exist');
    }

    const cartId = await this.prisma.cart.findUnique({
      where: {
        userId: userVerif.id,
      },
    });

    return await this.prisma.cart_Has_Product.updateMany({
      where: {
        cartId: cartId.id,
      },
      data: { ...dto },
    });
  }

  async deleteCartHasProduct(user: User, productId: string) {
    try {
      const userVerif = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });
      if (!userVerif) {
        throw new ForbiddenException('User does not exist');
      }

      const cart = await this.prisma.cart.findUnique({
        where: {
          userId: userVerif.id,
        },
      });
      if (!cart) {
        throw new NotFoundException('Cart not found for user');
      }

      const deleteResult = await this.prisma.cart_Has_Product.deleteMany({
        where: {
          id: productId,
        },
      });
      console.log('Delete result:', deleteResult);

      if (deleteResult.count === 0) {
        throw new NotFoundException('CartHasProduct not found');
      }

      return deleteResult;
    } catch (error) {
      console.error('Error deleting product from cart:', error);
      throw error;
    }
  }
}
