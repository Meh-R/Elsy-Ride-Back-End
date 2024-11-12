import { Module } from '@nestjs/common';
import { PaymentService } from './stripe.service';
import { PaymentController } from './stripe.controller';

@Module({
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
