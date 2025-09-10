import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../../user/entities/user.entity';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../user/entities/user.enums';
import { RequiredRole } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflect: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const {
      session: { user },
    } = context.switchToHttp().getRequest<{ session: { user: User } }>();

    const requiredRole = this.reflect?.getAllAndOverride<UserRole>(
      RequiredRole,
      [context.getHandler(), context.getClass()],
    );

    if (!user || !user.role) {
      return false;
    }

    return user.role === requiredRole;
  }
}
