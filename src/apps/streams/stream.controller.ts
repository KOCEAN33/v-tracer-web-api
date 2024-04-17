import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetTotalStreamTimeQuery } from './queries/get-total-stream-time.query';
import { GetStreamsCountQuery } from './queries/get-streams-count.query';

@Controller('/api/streams')
export class StreamController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get('/count/total-time')
  async totalStreamTime() {
    const query = new GetTotalStreamTimeQuery();
    return this.queryBus.execute(query);
  }
  @Get('/count')
  async streamsCount() {
    const query = new GetStreamsCountQuery();
    return this.queryBus.execute(query);
  }

  // @Get('/ratio/game')
  //
}
