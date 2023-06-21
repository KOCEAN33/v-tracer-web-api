import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ReviewRepository } from '../../repositories/review.repository';
import { GetReviewsByUserIdQuery } from '../get-reviews-by-userid.query';

@Injectable()
@QueryHandler(GetReviewsByUserIdQuery)
export class GetReviewsByUserIdQueryHandler
  implements IQueryHandler<GetReviewsByUserIdQuery>
{
  constructor(readonly reviewRepository: ReviewRepository) {}

  async execute(query: GetReviewsByUserIdQuery) {
    const { userId } = query;

    return this.reviewRepository.getReviewsByUserId(userId);
  }
}
