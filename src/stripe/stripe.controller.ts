import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './stripe.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/create-payment-intent')
  async createPaymentIntent(
    @Body() body: { amount: number; currency: string },
  ) {
    const { amount, currency } = body;
    return this.paymentService.createPaymentIntent(amount, currency);
  }
}
