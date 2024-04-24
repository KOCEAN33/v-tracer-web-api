import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { GetGameRankingHandler } from './queries/get-game-ranking.handler';
import { GamesRepository } from './repository/games.repository';
import { CqrsModule } from '@nestjs/cqrs';

const queryHandler = [GetGameRankingHandler];

@Module({
  imports: [CqrsModule],
  controllers: [GamesController],
  providers: [GamesService, GamesRepository, ...queryHandler],
})
export class GamesModule {}
