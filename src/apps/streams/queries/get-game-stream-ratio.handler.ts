import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { StreamRepository } from '../repository/stream.repository';
import { GetStreamsCountQuery } from './get-streams-count.query';
import { GetGameStreamRatioQuery } from './get-game-stream-ratio.query';

@QueryHandler(GetGameStreamRatioQuery)
export class GetGameStreamRatioHandler
  implements IQueryHandler<GetGameStreamRatioQuery>
{
  constructor(private readonly streamRepository: StreamRepository) {}

  async execute() {
    const totalStreamsCount = await this.streamRepository.getStreamsCount();
    const gameStreamsCount = await this.streamRepository.getGameStreamRatio();

    const result = this.calculatePercentage(
      totalStreamsCount,
      gameStreamsCount,
    );

    return {
      message: 'success',
      percent: result,
    };
  }

  private calculatePercentage(total: number, part: number): string {
    const percent = (part / total) * 100;

    return percent.toFixed(2);
  }
}
