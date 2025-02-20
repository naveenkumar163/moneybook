import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { JwtStrategy } from './auth/auth.jwt.strategy';
import { AdminController } from './admin/admin.controller';
import { MasterController } from './master/master.controller';
import { AgentController } from './agent/agent.controller';
import { ClientController } from './client/client.controller';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthModule } from './auth/auth.module';

import { Admin } from './models/admin.entity';
import { Master } from './models/master.entity';
import { Agent } from './models/agent.entity';
import { Client } from './models/client.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // ✅ Load environment variables
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'your_db_user',
      password: process.env.DB_PASSWORD || 'your_db_password',
      database: process.env.DB_NAME || 'your_db_name',
      ssl: { rejectUnauthorized: false }, // ✅ Force SSL for RDS
      entities: [Admin, Master, Agent, Client], // ✅ Register all entities
      synchronize: true, // ✅ Auto-sync database schema in development
    }),
    TypeOrmModule.forFeature([Admin, Master, Agent, Client]), // ✅ Register repositories
    AuthModule, // ✅ Import Auth Module
  ],
  controllers: [
    AppController,
    AuthController,
    AdminController,
    MasterController,
    AgentController,
    ClientController,
  ],
  providers: [
    AppService,
    JwtStrategy, // ✅ Ensure JwtStrategy is listed here
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // ✅ Global role-based access control
    },
  ],
})
export class AppModule {}
 