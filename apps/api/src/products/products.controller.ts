import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Public()
  @Get()
  list(@Query('locale') locale = 'en') {
    return this.products.list(locale);
  }

  @Public()
  @Get(':slug')
  getBySlug(@Param('slug') slug: string, @Query('locale') locale = 'en') {
    return this.products.getBySlug(slug, locale);
  }
}
