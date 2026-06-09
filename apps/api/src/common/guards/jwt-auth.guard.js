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
exports.JwtAuthGuard = exports.ACCESS_COOKIE = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const public_decorator_js_1 = require("../decorators/public.decorator.js");
exports.ACCESS_COOKIE = 'access_token';
let JwtAuthGuard = class JwtAuthGuard {
    reflector;
    jwt;
    config;
    constructor(reflector, jwt, config) {
        this.reflector = reflector;
        this.jwt = jwt;
        this.config = config;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_js_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic)
            return true;
        const req = context.switchToHttp().getRequest();
        const token = req.cookies?.[exports.ACCESS_COOKIE];
        if (!token)
            throw new common_1.UnauthorizedException('Missing access token');
        try {
            const payload = await this.jwt.verifyAsync(token, {
                secret: this.config.get('JWT_ACCESS_SECRET', { infer: true }),
            });
            req.user = {
                id: payload.sub,
                email: payload.email,
                roles: payload.roles ?? [],
                permissions: payload.permissions ?? [],
            };
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        jwt_1.JwtService,
        config_1.ConfigService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map