import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '@prisma/client';

import { GetUserFromTokenQuery } from './get-user.query';
import { AuthRepository } from '../repository/auth.repository';
import { UnauthorizedException } from '@nestjs/common';

@QueryHandler(GetUserFromTokenQuery)
export class GetUserFromTokenHandler
  implements IQueryHandler<GetUserFromTokenQuery>
{
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(query: GetUserFromTokenQuery): Promise<User> {
    const { userId } = query;

    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    return await this.authRepository.getUserById(userId);
  }
}
