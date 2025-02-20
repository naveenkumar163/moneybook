import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../enum/roles.enum';

@Controller('master')
@UseGuards(RolesGuard) // Protect this controller
export class MasterController {
  @Post('create-agent')
  @Roles(Role.MASTER) // Only MASTER can create AGENT
  createAgent(@Body() createAgentDto) {
    return { message: 'Agent created successfully!' };
  }
}
