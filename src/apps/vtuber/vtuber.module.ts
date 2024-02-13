import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { VtuberController } from './vtuber.controller';
import { VtuberRepository } from './repository/vtuber.repository';
import { VtuberService } from './vtuber.service';
import { LoggerModule } from '../../libs/modules/logger/logger.module';

@Module({
  imports: [CqrsModule],
  controllers: [VtuberController],
  providers: [VtuberRepository, VtuberService],
})
export class VtuberModule {}
