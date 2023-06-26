import { BadRequestException, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Review } from '@prisma/client';

import { ReviewRepository } from '../repositories/review.repository';
import { FindReviewByProductQuery } from './findReviewByProduct.query';

@Injectable()
@QueryHandler(FindReviewByProductQuery)
export class FindReviewByProductQueryHandler
  implements IQueryHandler<FindReviewByProductQuery>
{
  constructor(readonly reviewRepository: ReviewRepository) {}

  async execute(query: FindReviewByProductQuery): Promise<Review[]> {
    const { product, productId } = query;
    if (product == undefined && productId == undefined) {
      throw new BadRequestException('product handle or productId is required');
    }

    if (product && productId) {
      throw new BadRequestException(
        'product handle and productId both are not allowed',
      );
    }

    return this.reviewRepository.getReviewsByProduct(product, productId);
  }
}
