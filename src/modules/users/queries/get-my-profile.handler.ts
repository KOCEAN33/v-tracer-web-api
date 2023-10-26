import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';

import { GetMyProfileQuery } from './get-my-profile.query';
import { UserRepository } from '../repository/user.repository';

@QueryHandler(GetMyProfileQuery)
export class GetMyProfileHandler implements IQueryHandler<GetMyProfileQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetMyProfileQuery) {
    const { userId } = query;

    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.userRepository.getUserById(userId);

    return {
      id: user.id,
      name: user.name,
      image: user.image ? user.image : undefined,
    };
  }
}
