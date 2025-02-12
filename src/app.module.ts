import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ Import ConfigModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtStrategy } from './auth/auth.jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(), // ✅ Enables environment variables globally
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, JwtStrategy], // ✅ Include JwtStrategy
})
export class AppModule {}
