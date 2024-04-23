import { Controller, Get, UseInterceptors } from '@nestjs/common';

import { StreamService } from './stream.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('/api/streams')
export class StreamController {
  constructor(private streamService: StreamService) {}

  @Get('/count/total-time')
  async totalStreamTime() {
    return this.streamService.getTotalStreamTime();
  }
  @Get('/count')
  async streamsCount() {
    return this.streamService.getStreamsCount();
  }

  @Get('/ratio/game')
  async gameRatio() {
    return this.streamService.getGameStreamRatio();
  }

  @Get('/recent')
  async recentStreams() {
    return this.streamService.getRecentStreams();
  }
}
