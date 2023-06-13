import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateReviewByProductHandleCommand } from '../create-review.command';
import { ReviewRepository } from '../../repositories/review.repository';

@Injectable()
@CommandHandler(CreateReviewByProductHandleCommand)
export class CreateReviewByProductHandleHandler
  implements ICommandHandler<CreateReviewByProductHandleCommand>
{
  constructor(readonly reviewRepository: ReviewRepository) {}

  async execute(command: CreateReviewByProductHandleCommand) {
    const { authorId, productHandle, title, body, published } = command;

    const product = await this.reviewRepository.getProductByProductHandle(
      productHandle,
    );

    if (!product) {
      throw new NotFoundException(`Product ${productHandle} not exist`);
    }

    await this.reviewRepository.createReview(
      authorId,
      product.id,
      title,
      body,
      published,
    );

    return 'success';
  }
}
