// import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Role } from '../../enum/roles.enum';
// import { User } from '../../models/user.entity';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     if (!requiredRoles) {
//       return true; // No role restrictions on this route
//     }

//     const request = context.switchToHttp().getRequest();
//     const user: User = request.user;

//     if (!user || !requiredRoles.includes(user.role)) {
//       throw new ForbiddenException('Insufficient permissions');
//     }

//     return true;
//   }
// }

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../enum/roles.enum';
import { Request } from 'express';
import { User } from '../../models/user.entity'; // Import User entity

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required, grant access
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User; // ✅ Type assertion

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return requiredRoles.includes(user.role);
  }
}
