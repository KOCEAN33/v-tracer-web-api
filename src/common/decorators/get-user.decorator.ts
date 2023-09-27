import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../modules/auth/entity/user-id.entity';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.userId;
  },
);
