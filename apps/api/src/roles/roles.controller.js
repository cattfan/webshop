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
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("@webshop/types");
const roles_service_js_1 = require("./roles.service.js");
const roles_decorator_js_1 = require("../common/decorators/roles.decorator.js");
let RolesController = class RolesController {
    roles;
    constructor(roles) {
        this.roles = roles;
    }
    list() {
        return this.roles.list();
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_js_1.Roles)(types_1.Role.ADMIN),
    (0, roles_decorator_js_1.RequirePermissions)('roles.manage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "list", null);
exports.RolesController = RolesController = __decorate([
    (0, common_1.Controller)('admin/roles'),
    __metadata("design:paramtypes", [roles_service_js_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map