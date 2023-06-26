import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ReviewRepository } from '../repositories/review.repository';
import { DeleteReviewCommand } from './deleteReview.command';

@Injectable()
@CommandHandler(DeleteReviewCommand)
export class DeleteReviewCommandHandler
  implements ICommandHandler<DeleteReviewCommand>
{
  constructor(readonly reviewRepository: ReviewRepository) {}

  async execute(command: DeleteReviewCommand): Promise<void> {
    const { userId, reviewId } = command;

    const review = await this.reviewRepository.getAuthorIdByReviewId(reviewId);

    if (review === null) {
      throw new NotFoundException(`review ${reviewId} not found`);
    }

    if (review.deletedAt) {
      throw new ConflictException(`review ${reviewId} is already deleted`);
    }

    if (review.authorId !== userId) {
      throw new UnauthorizedException(`No Permission to delete ${reviewId}`);
    }

    await this.reviewRepository.deleteSoftReview(reviewId);
  }
}
