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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const argon2_1 = __importDefault(require("argon2"));
const types_1 = require("@webshop/types");
const prisma_service_js_1 = require("../prisma/prisma.service.js");
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async register(email, password, displayName) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        const passwordHash = await argon2_1.default.hash(password, { type: argon2_1.default.argon2id });
        const customerRole = await this.prisma.role.findUnique({ where: { name: types_1.Role.CUSTOMER } });
        const user = await this.prisma.user.create({
            data: {
                email,
                passwordHash,
                displayName,
                roles: customerRole ? { create: { roleId: customerRole.id } } : undefined,
            },
        });
        return this.toPublicUser(user.id);
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await argon2_1.default.verify(user.passwordHash, password);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (user.status !== 'ACTIVE')
            throw new common_1.UnauthorizedException('Account is not active');
        return this.toPublicUser(user.id);
    }
    async toPublicUser(userId) {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
            include: {
                roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
            },
        });
        const roles = user.roles.map((r) => r.role.name);
        const permissions = [
            ...new Set(user.roles.flatMap((r) => r.role.permissions.map((p) => p.permission.key))),
        ];
        return {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            roles,
            permissions,
        };
    }
    async issueTokens(user) {
        const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email, roles: user.roles, permissions: user.permissions }, {
            secret: this.config.get('JWT_ACCESS_SECRET', { infer: true }),
            expiresIn: this.config.get('JWT_ACCESS_TTL', { infer: true }),
        });
        const refreshToken = await this.jwt.signAsync({ sub: user.id, type: 'refresh' }, {
            secret: this.config.get('JWT_REFRESH_SECRET', { infer: true }),
            expiresIn: this.config.get('JWT_REFRESH_TTL', { infer: true }),
        });
        return { accessToken, refreshToken };
    }
    async refresh(refreshToken) {
        let sub;
        try {
            const payload = await this.jwt.verifyAsync(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET', { infer: true }),
            });
            if (payload.type !== 'refresh')
                throw new Error('wrong token type');
            sub = payload.sub;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const user = await this.toPublicUser(sub);
        const tokens = await this.issueTokens(user);
        return { user, tokens };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map