import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { GetGameRankingQuery } from './queries/get-game-ranking.query';

@Controller('/api/games')
export class GamesController {
  constructor(private queryBus: QueryBus) {}

  @Get('/ranking')
  async gameRanking() {
    const query = new GetGameRankingQuery();
    return this.queryBus.execute(query);
  }
}
