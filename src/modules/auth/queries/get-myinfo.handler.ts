import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';

import { AuthRepository } from '../repository/auth.repository';
import { GetMyInfoQuery } from './get-myinfo.query';

interface UserData {
  id: string;
  name: string;
  image: string;
}

@QueryHandler(GetMyInfoQuery)
export class GetUserFromTokenHandler implements IQueryHandler<GetMyInfoQuery> {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(query: GetMyInfoQuery): Promise<UserData> {
    const { userId } = query;

    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.authRepository.getUserById(userId);

    return {
      id: user.id,
      name: user.name,
      image: user.imageSrc,
    };
  }
}
