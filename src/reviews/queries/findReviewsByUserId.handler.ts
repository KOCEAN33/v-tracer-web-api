import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ReviewRepository } from '../repositories/review.repository';
import { FindReviewsByUserQuery } from './findReviewsByUserId.query';
import { Review } from '@prisma/client';

@Injectable()
@QueryHandler(FindReviewsByUserQuery)
export class FindReviewsByUserIdHandler
  implements IQueryHandler<FindReviewsByUserQuery>
{
  constructor(readonly reviewRepository: ReviewRepository) {}

  async execute(query: FindReviewsByUserQuery): Promise<Review[]> {
    const { userId, productId } = query;

    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.reviewRepository.getReviewsByUserIdProductId(userId, productId);
  }
}
