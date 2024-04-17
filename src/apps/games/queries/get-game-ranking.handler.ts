import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetGameRankingQuery } from './get-game-ranking.query';
import { GamesRepository } from '../repository/games.repository';

@QueryHandler(GetGameRankingQuery)
export class GetGameRankingHandler
  implements IQueryHandler<GetGameRankingQuery>
{
  constructor(private readonly gamesRepository: GamesRepository) {}

  async execute() {
    const ranking = await this.gamesRepository.getPlayedGameRanking();

    const rankingDuration = ranking.map((ranking) => {
      return {
        gameId: ranking.game_id,
        gameTitle: ranking.title,
        duration: this.convertTimeToHours(ranking.total_duration),
      };
    });

    return {
      message: 'success',
      ranking: rankingDuration,
    };
  }

  private convertTimeToHours(time: number): number {
    const hours = time / 3600;
    return Number(hours.toFixed(1));
  }
}
