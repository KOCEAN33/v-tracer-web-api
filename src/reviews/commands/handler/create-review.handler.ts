import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateReviewCommand } from '../create-review.command';
import { ReviewRepository } from '../../repositories/review.repository';

@Injectable()
@CommandHandler(CreateReviewCommand)
export class CreateReviewCommandHandler
  implements ICommandHandler<CreateReviewCommand>
{
  constructor(readonly reviewRepository: ReviewRepository) {}

  async execute(command: CreateReviewCommand) {
    const { authorId, productId, title, body, published } = command;

    await this.reviewRepository.createReview(
      authorId,
      productId,
      title,
      body,
      published,
    );

    return 'success';
  }
}
