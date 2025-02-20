// src/auth/dto/auth.dto.ts
import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional, ValidateIf, IsInt } from 'class-validator';
import { Role } from '../../enum/roles.enum';

export class SignupDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role; // ✅ Role must be 'admin', 'master', 'agent', or 'client'

  // ✅ Require `adminId` only if role is MASTER
  @ValidateIf((dto) => dto.role === Role.MASTER)
  @IsInt()
  @IsNotEmpty({ message: 'Masters must provide an admin ID.' })
  adminId?: number;

  @ValidateIf((dto) => dto.role === Role.AGENT)
  @IsInt()
  @IsNotEmpty({ message: 'Agent must provide an admin ID.' })
  masterId?: number;

  // ✅ Require `agentId` only if role is CLIENT
  @ValidateIf((dto) => dto.role === Role.CLIENT)
  @IsInt()
  @IsNotEmpty({ message: 'Clients must provide an agent ID.' })
  agentId?: number;
}

export class SigninDto {
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    password: string;
  }
