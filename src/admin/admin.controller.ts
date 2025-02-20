import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../enum/roles.enum';

@Controller('admin')
@UseGuards(RolesGuard) // Protect this controller
export class AdminController {
  @Get('dashboard')
  @Roles(Role.ADMIN) // Only ADMIN can access this
  getAdminDashboard() {
    return { message: 'Welcome, Admin!' };
  }
}
