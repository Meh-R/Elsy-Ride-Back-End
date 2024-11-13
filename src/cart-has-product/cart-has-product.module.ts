import { Module } from '@nestjs/common';
import { CartHasProductService } from './cart-has-product.service';
import { CartHasProductController } from './cart-has-product.controller';

@Module({
  controllers: [CartHasProductController],
  providers: [CartHasProductService],
})
export class CartHasProductModule {}
