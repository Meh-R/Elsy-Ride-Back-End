import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { cartId, cartHasProductId, total, status } = createOrderDto;
    return this.prisma.order.create({
      data: {
        cartId,
        cartHasProductId,
        total,
        status,
        purchaseDate: new Date(),
      },
      include: {
        cart: {
          include: {
            user: true,
            cart_Has_Product: {
              where: { id: cartHasProductId },
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        cart: {
          include: {
            user: true,
            cart_Has_Product: {
              where: { isActive: true },
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async findMany(cartId: string) {
    const order = await this.prisma.order.findMany({
      where: { cartId },
      include: {
        cart: {
          include: {
            user: true,
            cart_Has_Product: {
              where: { id: cartId },
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
    if (!order.length) throw new NotFoundException('Orders not found');
    return order;
  }

  async findByStatus(status: string) {
    const orders = await this.prisma.order.findMany({
      where: { status },
      include: {
        cart: {
          include: {
            user: true,
            cart_Has_Product: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!orders.length)
      throw new NotFoundException(`No orders found with status "${status}"`);
    return orders;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        cart: {
          include: {
            user: true,
            cart_Has_Product: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async remove(id: string) {
    const order = await this.prisma.order.delete({
      where: { id },
    });
    if (!order) throw new NotFoundException('Order not found');
    return { message: 'Order deleted successfully' };
  }
}
