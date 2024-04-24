import { Controller, Get } from '@nestjs/common';

import { StreamsService } from './streams.service';
import { CacheTTL } from '@nestjs/cache-manager';

@Controller('/api/streams')
export class StreamsController {
  constructor(private streamService: StreamsService) {}

  @Get('/count/total-time')
  @CacheTTL(60 * 60 * 1000)
  async totalStreamTime() {
    return this.streamService.getTotalStreamTime();
  }

  @Get('/count')
  @CacheTTL(60 * 60 * 1000)
  async streamsCount() {
    return this.streamService.getStreamsCount();
  }

  @Get('/ratio/game')
  @CacheTTL(60 * 60 * 1000)
  async gameRatio() {
    return this.streamService.getGameStreamRatio();
  }

  @Get('/recent')
  @CacheTTL(60 * 60 * 1000)
  async recentStreams() {
    return this.streamService.getRecentStreams();
  }
}
