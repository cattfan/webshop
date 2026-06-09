"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_js_1 = require("./app.module.js");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_js_1.AppModule, { bufferLogs: false });
    const config = app.get((config_1.ConfigService));
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.setGlobalPrefix('', { exclude: ['health'] });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    app.enableCors({
        origin: [config.get('STOREFRONT_ORIGIN'), config.get('ADMIN_ORIGIN')],
        credentials: true,
    });
    const port = config.get('API_PORT', { infer: true });
    await app.listen(port);
    common_1.Logger.log(`API listening on port ${port}`, 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map