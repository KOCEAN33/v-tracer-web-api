import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ReviewController } from './review.controller';
import { CreateReviewCommandHandler } from './commands/handler/create-review.handler';
import { ReviewRepository } from './repositories/review.repository';
import { GetReviewsByProductHandleQueryHandler } from './queries/handler/get-reviews-product-handle.handler';
import { GetReviewsByUserIdQueryHandler } from './queries/handler/by-userid.handler';
import { PatchReviewCommandHandler } from './commands/handler/patch-review.handler';

const commandHandlers = [CreateReviewCommandHandler, PatchReviewCommandHandler];
const queryHandlers = [
  GetReviewsByProductHandleQueryHandler,
  GetReviewsByUserIdQueryHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [ReviewController],
  providers: [...commandHandlers, ...queryHandlers, ReviewRepository],
})
export class ReviewModule {}
