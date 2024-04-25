import { Controller, Get } from '@nestjs/common';
import { CacheTTL } from '@nestjs/cache-manager';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { StreamsService } from './streams.service';
import { CountResDTO } from './dto/count.res.dto';
import { RecentResDTO } from './dto/recent.res.dto';

@ApiTags('Streams')
@Controller('/api/streams')
export class StreamsController {
  constructor(private streamService: StreamsService) {}

  @ApiOperation({
    summary: 'Get total stream time',
  })
  @ApiResponse({ status: 200, type: CountResDTO })
  @Get('/count/total-time')
  @CacheTTL(60 * 60 * 1000)
  async totalStreamTime(): Promise<CountResDTO> {
    return this.streamService.getTotalStreamTime();
  }

  @ApiOperation({
    summary: 'Get total stream count',
  })
  @ApiResponse({ status: 200, type: CountResDTO })
  @Get('/count')
  @CacheTTL(60 * 60 * 1000)
  async streamsCount(): Promise<CountResDTO> {
    return this.streamService.getStreamsCount();
  }

  @ApiOperation({
    summary: 'Get game & normal stream ratio',
  })
  @ApiResponse({ status: 200, type: CountResDTO })
  @Get('/ratio/game')
  @CacheTTL(60 * 60 * 1000)
  async gameRatio(): Promise<CountResDTO> {
    return this.streamService.getGameStreamRatio();
  }

  @ApiOperation({
    summary: 'Get recent streams',
  })
  @ApiResponse({ status: 200, type: RecentResDTO, isArray: true })
  @Get('/recent')
  @CacheTTL(60 * 60 * 1000)
  async recentStreams(): Promise<RecentResDTO[]> {
    return this.streamService.getRecentStreams();
  }
}
