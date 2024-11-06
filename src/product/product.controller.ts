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
import { ProductService } from './product.service';
import { JwtGuard } from 'src/auth/Guards';
import { cartHasProductDto, creatProductDto, updateProductDto } from './dto';
import { AdminGuard } from 'src/auth/Guards/auth.guard';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { updatCartHasProductDto } from './dto/updateCartHasProduct.dto';

@UseGuards(JwtGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/all/:page')
  getAllProduct(@Param('page') page: number) {
    return this.productService.getAllProduct(page);
  }

  @Get('/find/:query')
  findProduct(@Param('query') query: string) {
    return this.productService.findProduct(query);
  }

  @Get('/findId/:id')
  findProductByid(@Param('id') id: string) {
    return this.productService.findProductByid(id);
  }

  @Get('category/:type/:page')
  async getProductsByCategoryType(
    @Param('type') type: string,
    @Param('page') page: number,
  ) {
    return this.productService.getProductsByCategoryType(type, page);
  }

  @UseGuards(AdminGuard)
  @Post('/create')
  createProduct(@Body() dto: creatProductDto) {
    return this.productService.createProduct(dto);
  }

  @Patch('/update/:id')
  updateProduct(@Param('id') id: string, @Body() dto: updateProductDto) {
    return this.productService.updateProduct(id, dto);
  }

  @Delete('/delete/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @Post('/createCartHasProduct/:id')
  createCartHasProduct(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: cartHasProductDto,
  ) {
    return this.productService.createCartHasProduct(user, id, dto);
  }

  @Get('/myCartHasProduct')
  getMyCartHasProduct(@GetUser() user: User) {
    return this.productService.getMyCartHasProduct(user);
  }

  @Patch('/updateCartHasProduct/:id')
  updateCartHasProduct(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: updatCartHasProductDto,
  ) {
    return this.productService.updateCartHasProduct(user, id, dto);
  }

  @Delete('/deleteCartHasProduct/:id')
  deleteCartHasProduct(@GetUser() user: User, @Param('id') id: string) {
    return this.productService.deleteCartHasProduct(user, id);
  }
}
