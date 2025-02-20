"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_service_1 = require("./auth/auth.service");
const auth_controller_1 = require("./auth/auth.controller");
const auth_jwt_strategy_1 = require("./auth/auth.jwt.strategy");
const user_entity_1 = require("./models/user.entity");
const admin_controller_1 = require("./admin/admin.controller");
const master_controller_1 = require("./master/master.controller");
const agent_controller_1 = require("./agent/agent.controller");
const client_controller_1 = require("./client/client.controller");
const roles_guard_1 = require("./auth/guards/roles.guard");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: Number(process.env.DB_PORT) || 5432,
                username: process.env.DB_USER || 'your_db_user',
                password: process.env.DB_PASSWORD || 'your_db_password',
                database: process.env.DB_NAME || 'your_db_name',
                // ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
                ssl: { rejectUnauthorized: false }, // Force SSL
                entities: [user_entity_1.User],
                synchronize: false,
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            auth_module_1.AuthModule,
        ],
        controllers: [
            app_controller_1.AppController,
            auth_controller_1.AuthController,
            admin_controller_1.AdminController,
            master_controller_1.MasterController,
            agent_controller_1.AgentController,
            client_controller_1.ClientController,
        ],
        providers: [
            app_service_1.AppService,
            auth_service_1.AuthService,
            auth_jwt_strategy_1.JwtStrategy, // ✅ Ensure JwtStrategy is listed here
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard, // ✅ Global role-based access control
            },
        ],
    })
], AppModule);
