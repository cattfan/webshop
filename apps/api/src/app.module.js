"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const config_2 = require("@webshop/config");
const prisma_module_js_1 = require("./prisma/prisma.module.js");
const common_module_js_1 = require("./common/common.module.js");
const auth_module_js_1 = require("./auth/auth.module.js");
const users_module_js_1 = require("./users/users.module.js");
const roles_module_js_1 = require("./roles/roles.module.js");
const products_module_js_1 = require("./products/products.module.js");
const orders_module_js_1 = require("./orders/orders.module.js");
const payments_module_js_1 = require("./payments/payments.module.js");
const health_module_js_1 = require("./health/health.module.js");
const jwt_auth_guard_js_1 = require("./common/guards/jwt-auth.guard.js");
const roles_guard_js_1 = require("./common/guards/roles.guard.js");
const permissions_guard_js_1 = require("./common/guards/permissions.guard.js");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validate: (raw) => (0, config_2.parseApiEnv)(raw),
            }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
            prisma_module_js_1.PrismaModule,
            common_module_js_1.CommonModule,
            auth_module_js_1.AuthModule,
            users_module_js_1.UsersModule,
            roles_module_js_1.RolesModule,
            products_module_js_1.ProductsModule,
            orders_module_js_1.OrdersModule,
            payments_module_js_1.PaymentsModule,
            health_module_js_1.HealthModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_js_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_js_1.RolesGuard },
            { provide: core_1.APP_GUARD, useClass: permissions_guard_js_1.PermissionsGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map