import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth.jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Admin } from '../models/admin.entity';
import { Master } from '../models/master.entity';
import { Agent } from '../models/agent.entity';
import { Client } from '../models/client.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // ✅ Import ConfigModule for environment variables
    TypeOrmModule.forFeature([Admin, Master, Agent, Client]), // ✅ Register all repositories
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule], // ✅ Ensure ConfigModule is imported
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, JwtStrategy],
})
export class AuthModule {}
