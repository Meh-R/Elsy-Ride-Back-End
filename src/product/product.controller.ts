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
import { creatProductDto, updateProductDto } from './dto';
import { AdminGuard } from 'src/auth/Guards/auth.guard';

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
}
