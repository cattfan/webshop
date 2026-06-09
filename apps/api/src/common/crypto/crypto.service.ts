import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from 'node:crypto';
import type { ApiEnv } from '@webshop/config';

/**
 * AES-256-GCM envelope encryption for sensitive data at rest
 * (inventory credentials, fulfillment submissions, delivery results).
 * Never store these values as plaintext.
 */
@Injectable()
export class CryptoService {
  private readonly key: Buffer;
  readonly keyId: string;

  constructor(config: ConfigService<ApiEnv, true>) {
    const raw = config.get('ENCRYPTION_MASTER_KEY', { infer: true });
    // Accept base64 or utf8; normalize to 32 bytes via SHA-256.
    this.key = createHash('sha256').update(raw).digest();
    this.keyId = createHash('sha256').update(this.key).digest('hex').slice(0, 12);
  }

  encrypt(plaintext: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('base64')}.${tag.toString('base64')}.${enc.toString('base64')}`;
  }

  decrypt(payload: string): string {
    const [ivB64, tagB64, dataB64] = payload.split('.');
    if (!ivB64 || !tagB64 || !dataB64) {
      throw new Error('Invalid ciphertext format');
    }
    const decipher = createDecipheriv(
      'aes-256-gcm',
      this.key,
      Buffer.from(ivB64, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
    return Buffer.concat([
      decipher.update(Buffer.from(dataB64, 'base64')),
      decipher.final(),
    ]).toString('utf8');
  }
}
