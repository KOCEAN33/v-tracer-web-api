import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { GameRankingResDTO } from './dto/game-ranking.res.dto';
import { GetGameRankingQuery } from './queries/get-game-ranking.query';

@ApiTags('Games v1')
@Controller('/api/v1/games')
export class GamesController {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({
    summary: 'Get game ranking',
  })
  @ApiResponse({
    status: 200,
    isArray: true,
    type: GameRankingResDTO,
  })
  @Get('/ranking')
  @CacheTTL(60 * 60 * 1000)
  async gameRanking(): Promise<GameRankingResDTO[]> {
    const query = new GetGameRankingQuery();
    return await this.queryBus.execute(query);
  }
}
