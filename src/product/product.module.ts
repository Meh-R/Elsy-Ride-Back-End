import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ImageService } from 'src/image/image.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ImageService],
})
export class ProductModule {}
