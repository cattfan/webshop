import { Controller, Get } from '@nestjs/common';
import { Role } from '@webshop/types';
import { RolesService } from './roles.service.js';
import { Roles, RequirePermissions } from '../common/decorators/roles.decorator.js';

@Controller('admin/roles')
export class RolesController {
  constructor(private readonly roles: RolesService) {}

  @Get()
  @Roles(Role.ADMIN)
  @RequirePermissions('roles.manage')
  list() {
    return this.roles.list();
  }
}
