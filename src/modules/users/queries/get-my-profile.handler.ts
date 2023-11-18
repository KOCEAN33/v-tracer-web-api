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

    const user = await this.userRepository.getProfileByUserId(userId);

    return {
      id: user.user_id,
      name: user.name,
      image: user.image_url ? user.image_url : undefined,
    };
  }
}
