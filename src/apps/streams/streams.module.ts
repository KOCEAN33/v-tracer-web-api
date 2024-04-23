import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { StreamsController } from './streams.controller';
import { StreamsRepository } from './repository/streams.repository';
import { StreamsService } from './streams.service';

@Module({
  imports: [CqrsModule],
  controllers: [StreamsController],
  providers: [StreamsRepository, StreamsService],
})
export class StreamsModule {}
