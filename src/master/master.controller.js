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
exports.MasterController = void 0;
const common_1 = require("@nestjs/common");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_enum_1 = require("../enum/roles.enum");
let MasterController = class MasterController {
    createAgent(createAgentDto) {
        return { message: 'Agent created successfully!' };
    }
};
exports.MasterController = MasterController;
__decorate([
    (0, common_1.Post)('create-agent'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.MASTER) // Only MASTER can create AGENT
    ,
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MasterController.prototype, "createAgent", null);
exports.MasterController = MasterController = __decorate([
    (0, common_1.Controller)('master'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard) // Protect this controller
], MasterController);
