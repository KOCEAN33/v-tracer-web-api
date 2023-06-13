import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ReviewRepository } from '../../repositories/review.repository';
import { GetReviewsByProductHandleQuery } from '../get-reviews-product-handle.query';

@Injectable()
@QueryHandler(GetReviewsByProductHandleQuery)
export class GetReviewsByProductHandleQueryHandler
  implements IQueryHandler<GetReviewsByProductHandleQuery>
{
  constructor(readonly reviewRepository: ReviewRepository) {}

  async execute(query: GetReviewsByProductHandleQuery) {
    const { productHandle } = query;

    return this.reviewRepository.getReviewsByProductHandle(productHandle);
  }
}
