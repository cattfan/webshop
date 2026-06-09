import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@webshop/database';
import { OrderStatus } from '@webshop/types';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateOrderItemDto } from './dto/create-order.dto.js';

const PAYMENT_WINDOW_MS = 30 * 60 * 1000;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private generateOrderNo(): string {
    const ts = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    return `ORD${ts}${randomBytes(3).toString('hex').toUpperCase()}`;
  }

  async create(
    customerId: string,
    items: CreateOrderItemDto[],
    locale: string | undefined,
    idempotencyKey?: string,
  ) {
    if (idempotencyKey) {
      const existing = await this.prisma.order.findUnique({ where: { idempotencyKey } });
      if (existing) return this.toDetail(existing.id, customerId, true);
    }

    const variantIds = items.map((i) => i.variantId);
    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: variantIds }, isActive: true },
      include: { product: true },
    });
    if (variants.length !== new Set(variantIds).size) {
      throw new BadRequestException('One or more variants are unavailable');
    }
    const variantById = new Map(variants.map((v) => [v.id, v]));

    let total = new Prisma.Decimal(0);
    const itemData = items.map((i) => {
      const variant = variantById.get(i.variantId);
      if (!variant) throw new BadRequestException('Invalid variant');
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
        status: OrderStatus.PENDING_PAYMENT,
        totalUsd: total,
        locale: locale ?? 'en',
        idempotencyKey,
        paymentExpiresAt: new Date(Date.now() + PAYMENT_WINDOW_MS),
        items: { create: itemData },
      },
    });
    return this.toDetail(order.id, customerId, true);
  }

  async listMine(customerId: string) {
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

  async toDetail(orderId: string, requesterId: string, isOwner: boolean) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { variant: { include: { translations: true } } } },
        payments: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (isOwner && order.customerId !== requesterId) {
      throw new ForbiddenException('Not your order');
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

  async submitInfo(orderId: string, customerId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.customerId !== customerId) throw new ForbiddenException('Not your order');
    // Full encrypted submission handled in fulfillment milestone (M4).
    throw new BadRequestException('Fulfillment submission is implemented in a later milestone');
  }
}
