import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import argon2 from 'argon2';
import type { ApiEnv } from '@webshop/config';
import { Role } from '@webshop/types';
import { PrismaService } from '../prisma/prisma.service.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
  permissions: string[];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService<ApiEnv, true>,
  ) {}

  async register(email: string, password: string, displayName: string): Promise<PublicUser> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    const customerRole = await this.prisma.role.findUnique({ where: { name: Role.CUSTOMER } });

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

  async validateUser(email: string, password: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    if (user.status !== 'ACTIVE') throw new UnauthorizedException('Account is not active');
    return this.toPublicUser(user.id);
  }

  async toPublicUser(userId: string): Promise<PublicUser> {
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

  async issueTokens(user: PublicUser): Promise<AuthTokens> {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, roles: user.roles, permissions: user.permissions },
      {
        secret: this.config.get('JWT_ACCESS_SECRET', { infer: true }),
        expiresIn: this.config.get('JWT_ACCESS_TTL', { infer: true }),
      },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, type: 'refresh' },
      {
        secret: this.config.get('JWT_REFRESH_SECRET', { infer: true }),
        expiresIn: this.config.get('JWT_REFRESH_TTL', { infer: true }),
      },
    );
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    let sub: string;
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; type: string }>(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET', { infer: true }),
      });
      if (payload.type !== 'refresh') throw new Error('wrong token type');
      sub = payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.toPublicUser(sub);
    const tokens = await this.issueTokens(user);
    return { user, tokens };
  }
}
