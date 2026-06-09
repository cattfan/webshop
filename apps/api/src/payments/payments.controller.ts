import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PaymentsService } from './payments.service.js';
import { Public } from '../common/decorators/public.decorator.js';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator.js';

@Controller('payments/epusdt')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('create')
  create(@CurrentUser() user: AuthUser, @Body('orderId') orderId: string) {
    return this.payments.createForOrder(orderId, user.id);
  }

  /**
   * Gateway webhook. Signature verification, field validation, and idempotent
   * PAID transition are implemented in M2. Always responds with plain "ok".
   */
  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 60 } })
  @HttpCode(200)
  @Post('notify')
  notify(@Body() _payload: unknown): string {
    return 'ok';
  }
}
