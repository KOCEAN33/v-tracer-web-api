import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { GetGameRankingQuery } from './queries/get-game-ranking.query';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('/api/games')
export class GamesController {
  constructor(private queryBus: QueryBus) {}

  @Get('/ranking')
  @CacheTTL(60 * 60 * 1000)
  async gameRanking() {
    const query = new GetGameRankingQuery();
    return this.queryBus.execute(query);
  }
}
