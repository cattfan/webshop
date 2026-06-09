import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductStatus } from '@webshop/database';
import { PrismaService } from '../prisma/prisma.service.js';

const DEFAULT_LOCALE = 'en';

function pickTranslation<T extends { locale: string }>(
  translations: T[],
  locale: string,
): T | undefined {
  return (
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === DEFAULT_LOCALE) ??
    translations[0]
  );
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(locale: string) {
    const products = await this.prisma.product.findMany({
      where: { status: ProductStatus.ACTIVE, deletedAt: null },
      include: { translations: true, category: { include: { translations: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return products.map((p) => {
      const t = pickTranslation(p.translations, locale);
      const ct = p.category ? pickTranslation(p.category.translations, locale) : undefined;
      return {
        id: p.id,
        slug: p.slug,
        deliveryType: p.deliveryType,
        priceUsd: p.basePriceUsd.toString(),
        name: t?.name ?? p.slug,
        shortDesc: t?.shortDesc ?? null,
        category: p.category ? { slug: p.category.slug, name: ct?.name ?? p.category.slug } : null,
      };
    });
  }

  async getBySlug(slug: string, locale: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, status: ProductStatus.ACTIVE, deletedAt: null },
      include: {
        translations: true,
        category: { include: { translations: true } },
        variants: {
          where: { isActive: true },
          include: { translations: true },
        },
      },
    });
    if (!product) throw new NotFoundException('Product not found');

    const t = pickTranslation(product.translations, locale);
    return {
      id: product.id,
      slug: product.slug,
      deliveryType: product.deliveryType,
      priceUsd: product.basePriceUsd.toString(),
      name: t?.name ?? product.slug,
      shortDesc: t?.shortDesc ?? null,
      longDesc: t?.longDesc ?? null,
      variants: product.variants.map((v) => {
        const vt = pickTranslation(v.translations, locale);
        return {
          id: v.id,
          sku: v.sku,
          priceUsd: v.priceUsd.toString(),
          durationDays: v.durationDays,
          name: vt?.name ?? v.sku,
        };
      }),
    };
  }
}
