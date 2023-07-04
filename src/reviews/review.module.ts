import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ReviewController } from './review.controller';
import { ReviewRepository } from './repositories/review.repository';

import { CreateReviewCommandHandler } from './commands/create-review.handler';
import { PatchReviewCommandHandler } from './commands/patch-review.handler';
import { DeleteReviewCommandHandler } from './commands/delete-review.handler';
import { FindReviewByProductQueryHandler } from './queries/by-product.handler';
import { ByUserHandler } from './queries/by-user.handler';

const commandHandlers = [
  CreateReviewCommandHandler,
  PatchReviewCommandHandler,
  DeleteReviewCommandHandler,
];
const queryHandlers = [FindReviewByProductQueryHandler, ByUserHandler];

@Module({
  imports: [CqrsModule],
  controllers: [ReviewController],
  providers: [Logger, ...commandHandlers, ...queryHandlers, ReviewRepository],
})
export class ReviewModule {}
