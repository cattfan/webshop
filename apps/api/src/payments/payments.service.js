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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("@webshop/types");
const prisma_service_js_1 = require("../prisma/prisma.service.js");
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Creates a local payment record for an order. The live Epusdt/GMPay
     * create-transaction call and signed callback verification are wired in M2.
     */
    async createForOrder(orderId, customerId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { payments: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.customerId !== customerId)
            throw new common_1.ForbiddenException('Not your order');
        const existing = order.payments.find((p) => p.status === types_1.PaymentStatus.CREATED);
        if (existing) {
            return { paymentId: existing.id, status: existing.status, paymentUrl: existing.paymentUrl };
        }
        const payment = await this.prisma.payment.create({
            data: {
                orderId: order.id,
                provider: 'epusdt',
                status: types_1.PaymentStatus.CREATED,
                amountUsd: order.totalUsd,
                cryptoToken: 'usdt',
                network: 'tron',
            },
        });
        return { paymentId: payment.id, status: payment.status, paymentUrl: payment.paymentUrl };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map