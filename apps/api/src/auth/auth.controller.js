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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const auth_service_js_1 = require("./auth.service.js");
const auth_dto_js_1 = require("./dto/auth.dto.js");
const public_decorator_js_1 = require("../common/decorators/public.decorator.js");
const current_user_decorator_js_1 = require("../common/decorators/current-user.decorator.js");
const jwt_auth_guard_js_1 = require("../common/guards/jwt-auth.guard.js");
const REFRESH_COOKIE = 'refresh_token';
let AuthController = class AuthController {
    auth;
    config;
    constructor(auth, config) {
        this.auth = auth;
        this.config = config;
    }
    cookieOptions(maxAgeMs) {
        return {
            httpOnly: true,
            secure: this.config.get('COOKIE_SECURE', { infer: true }),
            sameSite: 'strict',
            domain: this.config.get('COOKIE_DOMAIN', { infer: true }),
            path: '/',
            maxAge: maxAgeMs,
        };
    }
    setAuthCookies(res, tokens) {
        res.cookie(jwt_auth_guard_js_1.ACCESS_COOKIE, tokens.accessToken, this.cookieOptions(15 * 60 * 1000));
        res.cookie(REFRESH_COOKIE, tokens.refreshToken, this.cookieOptions(30 * 24 * 60 * 60 * 1000));
    }
    async register(dto, res) {
        const user = await this.auth.register(dto.email, dto.password, dto.displayName);
        const tokens = await this.auth.issueTokens(user);
        this.setAuthCookies(res, tokens);
        return { user };
    }
    async login(dto, res) {
        const user = await this.auth.validateUser(dto.email, dto.password);
        const tokens = await this.auth.issueTokens(user);
        this.setAuthCookies(res, tokens);
        return { user };
    }
    async refresh(req, res) {
        const token = req.cookies?.[REFRESH_COOKIE];
        if (!token)
            throw new common_1.UnauthorizedException('Missing refresh token');
        const { user, tokens } = await this.auth.refresh(token);
        this.setAuthCookies(res, tokens);
        return { user };
    }
    logout(res) {
        res.clearCookie(jwt_auth_guard_js_1.ACCESS_COOKIE, { path: '/' });
        res.clearCookie(REFRESH_COOKIE, { path: '/' });
        return { ok: true };
    }
    async me(user) {
        return this.auth.toPublicUser(user.id);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_js_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, throttler_1.Throttle)({ default: { ttl: 60_000, limit: 5 } }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_js_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_js_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map