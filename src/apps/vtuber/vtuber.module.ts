import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { VtuberController } from './vtuber.controller';
import { VtuberRepository } from './repository/vtuber.repository';
import { VtuberService } from './vtuber.service';
import { GetVtuberCountHandler } from './queries/get-vtuber-count.handler';

const query = [GetVtuberCountHandler];

@Module({
  imports: [CqrsModule],
  controllers: [VtuberController],
  providers: [VtuberRepository, VtuberService, ...query],
})
export class VtuberModule {}
