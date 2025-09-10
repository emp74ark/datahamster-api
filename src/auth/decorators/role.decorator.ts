import { Reflector } from '@nestjs/core';
import { UserRole } from '../../user/entities/user.enums';

export const RequiredRole = Reflector.createDecorator<UserRole>();
