import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createCategoryDto } from 'src/category/dto/create.category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { cartHasProductDto } from './dto/cartHasProduct.dto';
import { Prisma, User } from '@prisma/client';
import { updatCartHasProductDto } from './dto/updateCartHasProduct.dto';

@Injectable()
export class CartHasProductService {
  constructor(private prisma: PrismaService) {}
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
