import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { VtuberController } from "./vtuber.controller";
import { VtuberRepository } from "./repository/vtuber.repository";


@Module({
  imports: [CqrsModule],
  controllers: [VtuberController,],
  providers: [VtuberRepository, ],
})
export class VtuberModule {}
