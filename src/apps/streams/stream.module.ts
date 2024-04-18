import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { StreamController } from './stream.controller';
import { StreamRepository } from './repository/stream.repository';
import { GetTotalStreamTimeHandler } from './queries/get-total-stream-time.handler';
import { GetStreamsCountHandler } from './queries/get-streams-count.handler';
import { GetGameStreamRatioHandler } from './queries/get-game-stream-ratio.handler';
import { GetRecentStreamsHandler } from './queries/get-recent-streams.handler';

const queryHandler = [
  GetTotalStreamTimeHandler,
  GetStreamsCountHandler,
  GetGameStreamRatioHandler,
  GetRecentStreamsHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [StreamController],
  providers: [StreamRepository, ...queryHandler],
})
export class StreamModule {}
