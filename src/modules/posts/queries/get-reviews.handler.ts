import { GetReviewsQuery } from './get-reviews.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PostRepository } from '../repositories/post.repository';

@QueryHandler(GetReviewsQuery)
export class GetReviewsHandler implements IQueryHandler<GetReviewsQuery> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(query: GetReviewsQuery) {
    const { productHandle } = query;
    const reviews =
      await this.postRepository.getReviewsByProduct(productHandle);

    return { message: 'success', data: reviews };
  }
}
