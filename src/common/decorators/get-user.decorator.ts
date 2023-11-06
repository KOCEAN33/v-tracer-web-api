import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    return Number(request.user.userId);
  },
);
