import { Controller, Get } from '@nestjs/common';
import { Role } from '@webshop/types';
import { OrdersService } from './orders.service.js';
import { Roles, RequirePermissions } from '../common/decorators/roles.decorator.js';

@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @RequirePermissions('orders.view.all')
  list() {
    return this.orders.listAll();
  }
}
