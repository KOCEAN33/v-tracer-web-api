import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ReviewRepository } from '../../repositories/review.repository';
import { PatchReviewCommand } from '../patch-review.command';

@Injectable()
@CommandHandler(PatchReviewCommand)
export class PatchReviewCommandHandler
  implements ICommandHandler<PatchReviewCommand>
{
  constructor(readonly reviewRepository: ReviewRepository) {}

  async execute(command: PatchReviewCommand) {
    const { authorId, reviewId, title, body, published } = command;

    const isAuthor = await this.checkReviewAuthor(authorId, reviewId);
    console.log('is author', isAuthor);

    if (!isAuthor) {
      throw new ForbiddenException(`Author doesn't match`);
    }

    await this.reviewRepository.patchReview(reviewId, title, body, published);

    return 'success';
  }

  private async checkReviewAuthor(authorId: string, reviewId: string) {
    const review = await this.reviewRepository.getReviewById(reviewId);

    if (review == null) {
      return false;
    }

    return review.id === authorId;
  }
}
