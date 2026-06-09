"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@webshop/database");
const prisma_service_js_1 = require("../prisma/prisma.service.js");
const DEFAULT_LOCALE = 'en';
function pickTranslation(translations, locale) {
    return (translations.find((t) => t.locale === locale) ??
        translations.find((t) => t.locale === DEFAULT_LOCALE) ??
        translations[0]);
}
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(locale) {
        const products = await this.prisma.product.findMany({
            where: { status: database_1.ProductStatus.ACTIVE, deletedAt: null },
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
    async getBySlug(slug, locale) {
        const product = await this.prisma.product.findFirst({
            where: { slug, status: database_1.ProductStatus.ACTIVE, deletedAt: null },
            include: {
                translations: true,
                category: { include: { translations: true } },
                variants: {
                    where: { isActive: true },
                    include: { translations: true },
                },
            },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map