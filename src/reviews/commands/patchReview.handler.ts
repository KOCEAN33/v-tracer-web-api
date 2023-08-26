import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ReviewRepository } from '../repositories/review.repository';
import { PatchReviewCommand } from './patchReview.command';

@Injectable()
@CommandHandler(PatchReviewCommand)
export class PatchReviewCommandHandler
  implements ICommandHandler<PatchReviewCommand>
{
  constructor(readonly reviewRepository: ReviewRepository) {}

  async execute(command: PatchReviewCommand): Promise<void> {
    const { authorId, reviewId, title, body } = command;

    if (!authorId) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (title == undefined && body == undefined) {
      throw new UnprocessableEntityException(
        'At least one of title or body are required',
      );
    }

    const review = await this.reviewRepository.getAuthorIdByReviewId(reviewId);

    if (review.deletedAt) {
      throw new NotFoundException('Review not found');
    }

    if (authorId != review.authorId) {
      throw new UnauthorizedException('NO PERMISSION');
    }

    await this.reviewRepository.patchReview(reviewId, title, body);
  }
}
