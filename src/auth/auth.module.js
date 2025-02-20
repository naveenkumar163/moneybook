"use strict";
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { User } from '../models/user.entity';
// import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './auth.jwt.strategy';
// import { PassportModule } from '@nestjs/passport';
// import { RolesGuard } from './guards/roles.guard';
// import { APP_GUARD } from '@nestjs/core';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
// @Module({
//   imports: [
//     TypeOrmModule.forFeature([User]), // ✅ Import the User entity
//     PassportModule.register({ defaultStrategy: 'jwt' }),
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'your_jwt_secret_key', // Use env for security
//       signOptions: { expiresIn: '1h' }, // Token expires in 1 hour
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [
//     AuthService,
//     JwtStrategy, 
//     {
//       provide: APP_GUARD, 
//       useClass: RolesGuard, // ✅ Register the RolesGuard globally
//     },
//   ],
//   exports: [AuthService, JwtModule], // ✅ Export AuthService and JwtModule
// })
// export class AuthModule {}
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config"); // ✅ Import ConfigModule
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const user_entity_1 = require("../models/user.entity");
const jwt_1 = require("@nestjs/jwt");
const auth_jwt_strategy_1 = require("./auth.jwt.strategy");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("./guards/roles.guard");
const core_1 = require("@nestjs/core");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(), // ✅ Add this to make ConfigService available
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
                signOptions: { expiresIn: '1h' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            auth_jwt_strategy_1.JwtStrategy,
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule],
    })
], AuthModule);
