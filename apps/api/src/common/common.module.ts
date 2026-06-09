import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { ApiEnv } from '@webshop/config';
import { CryptoService } from './crypto/crypto.service.js';
import { AuditService } from './audit/audit.service.js';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<ApiEnv, true>) => ({
        secret: config.get('JWT_ACCESS_SECRET', { infer: true }),
      }),
    }),
  ],
  providers: [CryptoService, AuditService],
  exports: [CryptoService, AuditService, JwtModule],
})
export class CommonModule {}
