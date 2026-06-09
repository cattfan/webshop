import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto, SubmitInfoDto } from './dto/create-order.dto.js';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator.js';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateOrderDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.orders.create(user.id, dto.items, dto.locale, idempotencyKey);
  }

  @Get('my')
  listMine(@CurrentUser() user: AuthUser) {
    return this.orders.listMine(user.id);
  }

  @Get(':id')
  getOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.orders.toDetail(id, user.id, true);
  }

  @Post(':id/submit-info')
  submitInfo(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() _dto: SubmitInfoDto,
  ) {
    return this.orders.submitInfo(id, user.id);
  }
}
