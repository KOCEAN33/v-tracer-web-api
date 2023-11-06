import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { PostController } from './post.controller';
import { PostRepository } from './repositories/post.repository';
import { CreatePostCommandHandler } from './commands/create-post.handler';
import { GetReviewsHandler } from './queries/get-reviews.handler';

const commandHandlers = [CreatePostCommandHandler];
const queryHandlers = [GetReviewsHandler];

@Module({
  imports: [CqrsModule],
  controllers: [PostController],
  providers: [Logger, PostRepository, ...commandHandlers, ...queryHandlers],
})
export class PostModule {}
