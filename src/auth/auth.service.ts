import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignupDto, SigninDto } from './dto/auth.dto';
import { Role } from '../enum/roles.enum';
import { Admin } from '../models/admin.entity';
import { Master } from '../models/master.entity';
import { Agent } from '../models/agent.entity';
import { Client } from '../models/client.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    @InjectRepository(Master) private readonly masterRepo: Repository<Master>,
    @InjectRepository(Agent) private readonly agentRepo: Repository<Agent>,
    @InjectRepository(Client) private readonly clientRepo: Repository<Client>,
    private readonly jwtService: JwtService
  ) {}

  // 🔹 User Signup
  async signup(signupDto: SignupDto): Promise<{ message: string }> {
    const { username, email, password, role, adminId, masterId, agentId } = signupDto;

     if (!username || !email || !password || !role) {
      throw new BadRequestException('Username, email, password, and role are required.');
    }

    if (role === Role.MASTER && !adminId) {
      throw new BadRequestException('Masters must provide an admin ID.');
    }

    if (role === Role.AGENT && !masterId) {
      throw new BadRequestException('Agent must provide an master ID.');
    }

    if (role === Role.CLIENT && !agentId) {
      throw new BadRequestException('Clients must provide an agent ID.');
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save in the correct table based on role
    switch (role) {
      case Role.ADMIN:
        const existingAdmin = await this.adminRepo.findOne({ where: { email } });
        if (existingAdmin) throw new ConflictException('Admin already exists');
        const newAdmin = this.adminRepo.create({ username, email, password: hashedPassword });
        await this.adminRepo.save(newAdmin);
        break;
  
      case Role.MASTER:
        const existingMaster = await this.masterRepo.findOne({ where: { email } });
        if (existingMaster) throw new ConflictException('Master already exists');
  
        // ✅ Fetch Admin Entity
        const admin = await this.adminRepo.findOne({ where: { id: adminId } });
        if (!admin) throw new BadRequestException('Invalid Admin ID.');
  
        const newMaster = this.masterRepo.create({ username, email, password: hashedPassword, admin });
        await this.masterRepo.save(newMaster);
        break;
  
      case Role.AGENT:
        const existingAgent = await this.agentRepo.findOne({ where: { email } });
        if (existingAgent) throw new ConflictException('Agent already exists');
  
        // ✅ Fetch Master Entity
        const master = await this.masterRepo.findOne({ where: { id: masterId } });
        if (!master) throw new BadRequestException('Invalid Master ID.');
  
        const newAgent = this.agentRepo.create({ username, email, password: hashedPassword, master });
        await this.agentRepo.save(newAgent);
        break;
  
      case Role.CLIENT:
        const existingClient = await this.clientRepo.findOne({ where: { email } });
        if (existingClient) throw new ConflictException('Client already exists');
  
        // ✅ Fetch Agent Entity
        const agent = await this.agentRepo.findOne({ where: { id: agentId } });
        if (!agent) throw new BadRequestException('Invalid Agent ID.');
  
        const newClient = this.clientRepo.create({ username, email, password: hashedPassword, agent });
        await this.clientRepo.save(newClient);
        break;
  
      default:
        throw new UnauthorizedException('Invalid role');
    }

    return { message: `${role} registered successfully` };
  }

  // 🔹 User Signin
  async signin(email: string, password: string): Promise<{ accessToken: string }> {
    let user = await this.adminRepo.findOne({ where: { email } }) ||
               await this.masterRepo.findOne({ where: { email } }) ||
               await this.agentRepo.findOne({ where: { email } }) ||
               await this.clientRepo.findOne({ where: { email } });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    // Generate JWT Token
    const payload = { userId: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
