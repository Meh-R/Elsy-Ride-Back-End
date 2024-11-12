import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { userUpdateDto } from './dto/user.update.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(user: User) {
    const userWithDetails = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        cart: {
          include: {
            cart_Has_Product: {
              include: {
                product: true,
              },
            },
            orders: true,
          },
        },
      },
    });

    if (!userWithDetails) {
      throw new ForbiddenException('User not found or unauthorized.');
    }

    return userWithDetails;
  }

  async getAllUser(user: User, page: number) {
    const userVerif = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!userVerif || userVerif.role != 'admin') {
      throw new ForbiddenException('no right');
    }

    return this.prisma.user.findMany({
      orderBy: {
        created_at: 'desc',
      },
      skip: page * 4,
      take: 4,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        adresse: true,
        city: true,
        postaleCode: true,
        created_at: true,
        updated_at: true,
        isActive: true,
      },
    });
  }

  async findUser(user: User, query: string) {
    const userVerif = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        cart: true,
      },
    });
    if (!userVerif || userVerif.role != 'admin') {
      throw new ForbiddenException('no right');
    }
    return this.prisma.user.findMany({
      where: {
        OR: [
          {
            email: {
              contains: query,
            },
          },
        ],
      },
    });
  }

  async updateUser(user: User, id: string, dto: userUpdateDto) {
    const userVerif = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!userVerif || (userVerif.id != id && userVerif.role != 'admin')) {
      throw new ForbiddenException('no right');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingUser) {
      throw new ForbiddenException('User to update not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
      },
    });
    return updatedUser;
  }

  async updateMyProfile(user: User, dto: userUpdateDto) {
    const userVerif = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!userVerif) {
      throw new ForbiddenException('user does not exist');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...dto,
      },
    });
    return updatedUser;
  }

  async deleteUser(user: User, id: string) {
    const userVerif = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!userVerif || (userVerif.id != id && userVerif.role != 'admin')) {
      throw new ForbiddenException('no right');
    }

    const idCart = await this.prisma.cart.findUnique({
      where: {
        userId: id,
      },
    });

    await this.prisma.cart_Has_Product.deleteMany({
      where: {
        cartId: idCart.id,
      },
    });
    await this.prisma.cart.deleteMany({
      where: {
        userId: id,
      },
    });
    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    return 'User deleted';
  }

  async deleteMyProfile(user: User) {
    const userVerif = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!userVerif) {
      throw new ForbiddenException('no does');
    }

    const idCart = await this.prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
    });

    await this.prisma.cart_Has_Product.deleteMany({
      where: {
        cartId: idCart.id,
      },
    });
    await this.prisma.cart.deleteMany({
      where: {
        userId: user.id,
      },
    });
    await this.prisma.user.delete({
      where: {
        id: user.id,
      },
    });
    return 'User deleted';
  }

  async disableMyProfile(user: User) {
    const userVerif = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!userVerif) {
      throw new ForbiddenException('no does');
    }
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isActive: 0,
      },
    });
    return 'User deleted';
  }
}
