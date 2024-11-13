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
import { CartHasProductService } from './cart-has-product.service';
import { JwtGuard } from 'src/auth/Guards';
import { cartHasProductDto } from './dto/cartHasProduct.dto';
import { AdminGuard } from 'src/auth/Guards/auth.guard';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { updatCartHasProductDto } from './dto/updateCartHasProduct.dto';

@UseGuards(JwtGuard)
@Controller('cart-has-product')
export class CartHasProductController {
  constructor(private readonly cartHasProductService: CartHasProductService) {}

  @Post('/createCartHasProduct/:id')
  createCartHasProduct(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: cartHasProductDto,
  ) {
    return this.cartHasProductService.createCartHasProduct(user, id, dto);
  }

  @Get('/myCartHasProduct')
  getMyCartHasProduct(@GetUser() user: User) {
    return this.cartHasProductService.getMyCartHasProduct(user);
  }

  @Patch('/updateCartHasProduct/:id')
  updateCartHasProduct(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: updatCartHasProductDto,
  ) {
    return this.cartHasProductService.updateCartHasProduct(user, id, dto);
  }

  @Delete('/deleteCartHasProduct/:id')
  deleteCartHasProduct(@GetUser() user: User, @Param('id') id: string) {
    return this.cartHasProductService.deleteCartHasProduct(user, id);
  }
}
