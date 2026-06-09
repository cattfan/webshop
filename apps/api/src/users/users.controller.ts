import { Controller, Get } from '@nestjs/common';
import { Role } from '@webshop/types';
import { UsersService } from './users.service.js';
import { Roles, RequirePermissions } from '../common/decorators/roles.decorator.js';

@Controller('admin/users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @RequirePermissions('users.manage')
  list() {
    return this.users.list();
  }
}
