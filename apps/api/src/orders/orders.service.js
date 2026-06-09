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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@webshop/database");
const types_1 = require("@webshop/types");
const node_crypto_1 = require("node:crypto");
const prisma_service_js_1 = require("../prisma/prisma.service.js");
const PAYMENT_WINDOW_MS = 30 * 60 * 1000;
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateOrderNo() {
        const ts = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
        return `ORD${ts}${(0, node_crypto_1.randomBytes)(3).toString('hex').toUpperCase()}`;
    }
    async create(customerId, items, locale, idempotencyKey) {
        if (idempotencyKey) {
            const existing = await this.prisma.order.findUnique({ where: { idempotencyKey } });
            if (existing)
                return this.toDetail(existing.id, customerId, true);
        }
        const variantIds = items.map((i) => i.variantId);
        const variants = await this.prisma.productVariant.findMany({
            where: { id: { in: variantIds }, isActive: true },
            include: { product: true },
        });
        if (variants.length !== new Set(variantIds).size) {
            throw new common_1.BadRequestException('One or more variants are unavailable');
        }
        const variantById = new Map(variants.map((v) => [v.id, v]));
        let total = new database_1.Prisma.Decimal(0);
        const itemData = items.map((i) => {
            const variant = variantById.get(i.variantId);
            if (!variant)
                throw new common_1.BadRequestException('Invalid variant');
            total = total.add(variant.priceUsd.mul(i.quantity));
            return {
                variantId: variant.id,
                quantity: i.quantity,
                unitPriceUsd: variant.priceUsd,
                deliveryType: variant.product.deliveryType,
            };
        });
        const order = await this.prisma.order.create({
            data: {
                orderNo: this.generateOrderNo(),
                customerId,
                status: types_1.OrderStatus.PENDING_PAYMENT,
                totalUsd: total,
                locale: locale ?? 'en',
                idempotencyKey,
                paymentExpiresAt: new Date(Date.now() + PAYMENT_WINDOW_MS),
                items: { create: itemData },
            },
        });
        return this.toDetail(order.id, customerId, true);
    }
    async listMine(customerId) {
        const orders = await this.prisma.order.findMany({
            where: { customerId },
            orderBy: { createdAt: 'desc' },
            include: { items: true },
        });
        return orders.map((o) => ({
            id: o.id,
            orderNo: o.orderNo,
            status: o.status,
            totalUsd: o.totalUsd.toString(),
            itemCount: o.items.length,
            createdAt: o.createdAt,
        }));
    }
    async toDetail(orderId, requesterId, isOwner) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: { include: { variant: { include: { translations: true } } } },
                payments: true,
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (isOwner && order.customerId !== requesterId) {
            throw new common_1.ForbiddenException('Not your order');
        }
        return {
            id: order.id,
            orderNo: order.orderNo,
            status: order.status,
            totalUsd: order.totalUsd.toString(),
            currency: order.currencySnapshot,
            paymentExpiresAt: order.paymentExpiresAt,
            items: order.items.map((it) => ({
                id: it.id,
                variantId: it.variantId,
                quantity: it.quantity,
                unitPriceUsd: it.unitPriceUsd.toString(),
                deliveryType: it.deliveryType,
            })),
            payment: order.payments[0]
                ? { status: order.payments[0].status, paymentUrl: order.payments[0].paymentUrl }
                : null,
            createdAt: order.createdAt,
        };
    }
    async submitInfo(orderId, customerId) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.customerId !== customerId)
            throw new common_1.ForbiddenException('Not your order');
        // Full encrypted submission handled in fulfillment milestone (M4).
        throw new common_1.BadRequestException('Fulfillment submission is implemented in a later milestone');
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map