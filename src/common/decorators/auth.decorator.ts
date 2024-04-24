import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { HasRole } from './role.decorator';
import { RolesGuard } from '../../modules/auth/guards/role.guard';

export function AuthAdmin() {
  return applyDecorators(
    HasRole('ADMIN'),
    UseGuards(AuthGuard('jwt'), RolesGuard),
  );
}
