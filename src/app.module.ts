import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';
import { ImageModule } from './image/image.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './stripe/stripe.module';
import { CartHasProductModule } from './cart-has-product/cart-has-product.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EmailModule,
    UserModule,
    ProductModule,
    CategoryModule,
    CartModule,
    ImageModule,
    OrderModule,
    PaymentModule,
    CartHasProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
