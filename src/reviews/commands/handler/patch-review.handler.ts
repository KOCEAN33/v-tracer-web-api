import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
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
    const { authorId, reviewId, title, body } = command;

    if ((title && body) == undefined) {
      console.log('is undefined');
      throw new UnprocessableEntityException(
        'At least one of title or body are required',
      );
    }

    console.log(title, body);

    const isAuthor = await this.checkReviewAuthor(authorId, reviewId);

    if (!isAuthor) {
      throw new ForbiddenException(`Author doesn't match`);
    }

    await this.reviewRepository.patchReview(reviewId, title, body);

    return 'success';
  }

  private async checkReviewAuthor(authorId: string, reviewId: string) {
    const review = await this.reviewRepository.getReviewById(reviewId);
    console.log('review', review);

    if (review == null) {
      return false;
    }

    return review.authorId === authorId;
  }
}
