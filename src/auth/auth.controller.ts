import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../enum/roles.enum';
import { SignupDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('signup')
  // async signup(@Body() body) {
  //   return this.authService.signup(body); // ✅ Pass full DTO instead of separate params
  // }
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
  @Post('signin')
  async signIn(@Body() body: { email: string; password: string }) {
    return this.authService.signin(body.email, body.password); // ✅ Use email, not username
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard) // ✅ Use correct guard
  getProfile(@Request() req) {
    return req.user;
  }

  // 🔹 Admin Dashboard
  @Get('admin-dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard) // ✅ Ensure JWT validation before checking roles
  @Roles(Role.ADMIN)
  adminDashboard(@Request() req) {
    return { message: 'Welcome, Admin', user: req.user };
  }

  // 🔹 Master Dashboard
  @Get('master-dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MASTER)
  masterDashboard(@Request() req) {
    return { message: 'Welcome, Master', user: req.user };
  }

  // 🔹 Agent Dashboard
  @Get('agent-dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.AGENT)
  agentDashboard(@Request() req) {
    return { message: 'Welcome, Agent', user: req.user };
  }

  // 🔹 Client Dashboard
  @Get('client-dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  clientDashboard(@Request() req) {
    return { message: 'Welcome, Client', user: req.user };
  }
}
