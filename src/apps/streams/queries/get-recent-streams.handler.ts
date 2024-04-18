import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { StreamRepository } from '../repository/stream.repository';
import { GetRecentStreamsQuery } from './get-recent-streams.query';

@QueryHandler(GetRecentStreamsQuery)
export class GetRecentStreamsHandler
  implements IQueryHandler<GetRecentStreamsQuery>
{
  constructor(private readonly streamRepository: StreamRepository) {}

  async execute() {
    const recentStreamsWithName =
      await this.streamRepository.getRecentStreams();

    return {
      message: 'success',
      result: recentStreamsWithName,
    };
  }
}
