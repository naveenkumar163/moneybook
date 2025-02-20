import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtected(@Request() req) {
    return { message: 'You are authorized!', user: req.user };
  }
}

