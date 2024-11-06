import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtGuard } from 'src/auth/Guards';
import { AdminGuard } from 'src/auth/Guards/auth.guard';
@UseGuards(JwtGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }
  @UseGuards(AdminGuard)
  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @Get('cart/:id')
  async findMany(@Param('id') id: string) {
    return this.orderService.findMany(id);
  }
  @UseGuards(AdminGuard)
  @Get('status/:status')
  async findByStatus(@Param('status') status: string) {
    return this.orderService.findByStatus(status);
  }
  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }
  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
