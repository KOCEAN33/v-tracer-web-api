import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { StreamsController } from './streams.controller';
import { StreamsRepository } from './repository/streams.repository';

@Module({
  imports: [CqrsModule],
  controllers: [StreamsController],
  providers: [StreamsRepository],
})
export class StreamsModule {}
