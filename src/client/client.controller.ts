import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../enum/roles.enum';

@Controller('client')
@UseGuards(RolesGuard)
export class ClientController {
  @Get('profile')
  @Roles(Role.CLIENT) // Only CLIENT can access this
  getClientProfile() {
    return { message: 'Client profile data' };
  }
}
