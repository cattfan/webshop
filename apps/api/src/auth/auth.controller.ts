import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response, CookieOptions } from 'express';
import type { ApiEnv } from '@webshop/config';
import { AuthService, type AuthTokens } from './auth.service.js';
import { LoginDto, RegisterDto } from './dto/auth.dto.js';
import { Public } from '../common/decorators/public.decorator.js';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator.js';
import { ACCESS_COOKIE } from '../common/guards/jwt-auth.guard.js';

const REFRESH_COOKIE = 'refresh_token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService<ApiEnv, true>,
  ) {}

  private cookieOptions(maxAgeMs: number): CookieOptions {
    return {
      httpOnly: true,
      secure: this.config.get('COOKIE_SECURE', { infer: true }),
      sameSite: 'strict',
      domain: this.config.get('COOKIE_DOMAIN', { infer: true }),
      path: '/',
      maxAge: maxAgeMs,
    };
  }

  private setAuthCookies(res: Response, tokens: AuthTokens): void {
    res.cookie(ACCESS_COOKIE, tokens.accessToken, this.cookieOptions(15 * 60 * 1000));
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, this.cookieOptions(30 * 24 * 60 * 60 * 1000));
  }

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.register(dto.email, dto.password, dto.displayName);
    const tokens = await this.auth.issueTokens(user);
    this.setAuthCookies(res, tokens);
    return { user };
  }

  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    const tokens = await this.auth.issueTokens(user);
    this.setAuthCookies(res, tokens);
    return { user };
  }

  @Public()
  @HttpCode(200)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (!token) throw new UnauthorizedException('Missing refresh token');
    const { user, tokens } = await this.auth.refresh(token);
    this.setAuthCookies(res, tokens);
    return { user };
  }

  @HttpCode(200)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ACCESS_COOKIE, { path: '/' });
    res.clearCookie(REFRESH_COOKIE, { path: '/' });
    return { ok: true };
  }

  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    return this.auth.toPublicUser(user.id);
  }
}
