import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { StreamController } from './stream.controller';
import { StreamRepository } from './repository/stream.repository';
import { StreamService } from './stream.service';

@Module({
  imports: [CqrsModule],
  controllers: [StreamController],
  providers: [StreamRepository, StreamService],
})
export class StreamModule {}
