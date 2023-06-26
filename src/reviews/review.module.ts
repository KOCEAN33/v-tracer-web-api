import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ReviewController } from './review.controller';
import { ReviewRepository } from './repositories/review.repository';

import { CreateReviewCommandHandler } from './commands/createReview.handler';
import { PatchReviewCommandHandler } from './commands/patchReview.handler';
import { DeleteReviewCommandHandler } from './commands/deleteReview.handler';
import { FindReviewByProductQueryHandler } from './queries/findReviewByProduct.handler';
import { FindReviewsByUserIdHandler } from './queries/findReviewsByUserId.handler';

const commandHandlers = [
  CreateReviewCommandHandler,
  PatchReviewCommandHandler,
  DeleteReviewCommandHandler,
];
const queryHandlers = [
  FindReviewByProductQueryHandler,
  FindReviewsByUserIdHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [ReviewController],
  providers: [Logger, ...commandHandlers, ...queryHandlers, ReviewRepository],
})
export class ReviewModule {}
