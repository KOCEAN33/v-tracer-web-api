import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { PostController } from './post.controller';
import { PostRepository } from './repositories/post.repository';

const commandHandlers = [];
const queryHandlers = [];

@Module({
  imports: [CqrsModule],
  controllers: [PostController],
  providers: [Logger, PostRepository, ...commandHandlers, ...queryHandlers],
})
export class PostModule {}
