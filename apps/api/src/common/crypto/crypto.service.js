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
exports.CryptoService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_crypto_1 = require("node:crypto");
/**
 * AES-256-GCM envelope encryption for sensitive data at rest
 * (inventory credentials, fulfillment submissions, delivery results).
 * Never store these values as plaintext.
 */
let CryptoService = class CryptoService {
    key;
    keyId;
    constructor(config) {
        const raw = config.get('ENCRYPTION_MASTER_KEY', { infer: true });
        // Accept base64 or utf8; normalize to 32 bytes via SHA-256.
        this.key = (0, node_crypto_1.createHash)('sha256').update(raw).digest();
        this.keyId = (0, node_crypto_1.createHash)('sha256').update(this.key).digest('hex').slice(0, 12);
    }
    encrypt(plaintext) {
        const iv = (0, node_crypto_1.randomBytes)(12);
        const cipher = (0, node_crypto_1.createCipheriv)('aes-256-gcm', this.key, iv);
        const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();
        return `${iv.toString('base64')}.${tag.toString('base64')}.${enc.toString('base64')}`;
    }
    decrypt(payload) {
        const [ivB64, tagB64, dataB64] = payload.split('.');
        if (!ivB64 || !tagB64 || !dataB64) {
            throw new Error('Invalid ciphertext format');
        }
        const decipher = (0, node_crypto_1.createDecipheriv)('aes-256-gcm', this.key, Buffer.from(ivB64, 'base64'));
        decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
        return Buffer.concat([
            decipher.update(Buffer.from(dataB64, 'base64')),
            decipher.final(),
        ]).toString('utf8');
    }
};
exports.CryptoService = CryptoService;
exports.CryptoService = CryptoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CryptoService);
//# sourceMappingURL=crypto.service.js.map