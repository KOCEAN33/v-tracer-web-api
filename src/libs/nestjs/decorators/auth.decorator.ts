import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../apps/auth/guards/jwt.guard';

export function Auth() {
  return applyDecorators(UseGuards(JwtGuard));
}
