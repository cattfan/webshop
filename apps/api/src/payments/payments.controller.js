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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const payments_service_js_1 = require("./payments.service.js");
const public_decorator_js_1 = require("../common/decorators/public.decorator.js");
const current_user_decorator_js_1 = require("../common/decorators/current-user.decorator.js");
let PaymentsController = class PaymentsController {
    payments;
    constructor(payments) {
        this.payments = payments;
    }
    create(user, orderId) {
        return this.payments.createForOrder(orderId, user.id);
    }
    /**
     * Gateway webhook. Signature verification, field validation, and idempotent
     * PAID transition are implemented in M2. Always responds with plain "ok".
     */
    notify(_payload) {
        return 'ok';
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, current_user_decorator_js_1.CurrentUser)()),
    __param(1, (0, common_1.Body)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "create", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, throttler_1.Throttle)({ default: { ttl: 60_000, limit: 60 } }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('notify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], PaymentsController.prototype, "notify", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments/epusdt'),
    __metadata("design:paramtypes", [payments_service_js_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map