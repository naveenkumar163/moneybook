import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../enum/roles.enum';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('agent')
@UseGuards(RolesGuard)
export class AgentController {
  @Post('create-client')
  @Roles(Role.AGENT) // Only AGENT can create CLIENT
  createClient(@Body() createClientDto : CreateClientDto) {
    return { message: 'Client created successfully!' };
  }
}
