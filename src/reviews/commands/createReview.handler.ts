import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateReviewCommand } from './createReview.command';
import { ReviewRepository } from '../repositories/review.repository';

@Injectable()
@CommandHandler(CreateReviewCommand)
export class CreateReviewCommandHandler
  implements ICommandHandler<CreateReviewCommand>
{
  constructor(readonly reviewRepository: ReviewRepository) {}

  async execute(command: CreateReviewCommand): Promise<void> {
    const { authorId, productId, title, body, publish } = command;

    if (!authorId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const publishedAt = this.publishing(publish);

    await this.reviewRepository.createReview(
      authorId,
      productId,
      title,
      body,
      publishedAt,
    );
  }

  private publishing(publish) {
    if (publish) {
      return new Date();
    } else {
      return null;
    }
  }
}
