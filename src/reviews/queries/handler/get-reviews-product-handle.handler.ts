import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ReviewRepository } from '../../repositories/review.repository';
import { PublicGetReviewsQuery } from '../get-reviews-product-handle.query';

@Injectable()
@QueryHandler(PublicGetReviewsQuery)
export class GetReviewsByProductQueryHandler
  implements IQueryHandler<PublicGetReviewsQuery>
{
  constructor(readonly reviewRepository: ReviewRepository) {}

  async execute(query: PublicGetReviewsQuery) {
    const { handle, productId } = query;

    return this.reviewRepository.getReviewsByProduct(handle, productId);
  }
}
