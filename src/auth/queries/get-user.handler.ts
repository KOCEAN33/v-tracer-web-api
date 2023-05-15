import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '@prisma/client';

import { GetUserFromTokenQuery } from './get-user.query';
import { AuthRepository } from '../repository/auth.repository';

@QueryHandler(GetUserFromTokenQuery)
export class GetUserFromTokenHandler
  implements IQueryHandler<GetUserFromTokenQuery>
{
  constructor(private readonly repository: AuthRepository) {}

  async execute(query: GetUserFromTokenQuery): Promise<User> {
    const { userId } = query;

    return await this.repository.getUserById(userId);
  }
}
