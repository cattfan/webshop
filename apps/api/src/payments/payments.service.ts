import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentStatus } from '@webshop/types';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a local payment record for an order. The live Epusdt/GMPay
   * create-transaction call and signed callback verification are wired in M2.
   */
  async createForOrder(orderId: string, customerId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.customerId !== customerId) throw new ForbiddenException('Not your order');

    const existing = order.payments.find((p) => p.status === PaymentStatus.CREATED);
    if (existing) {
      return { paymentId: existing.id, status: existing.status, paymentUrl: existing.paymentUrl };
    }

    const payment = await this.prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'epusdt',
        status: PaymentStatus.CREATED,
        amountUsd: order.totalUsd,
        cryptoToken: 'usdt',
        network: 'tron',
      },
    });
    return { paymentId: payment.id, status: payment.status, paymentUrl: payment.paymentUrl };
  }
}
