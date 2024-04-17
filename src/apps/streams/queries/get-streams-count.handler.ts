import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { StreamRepository } from '../repository/stream.repository';
import { GetStreamsCountQuery } from './get-streams-count.query';

@QueryHandler(GetStreamsCountQuery)
export class GetStreamsCountHandler
  implements IQueryHandler<GetStreamsCountQuery>
{
  constructor(private readonly streamRepository: StreamRepository) {}

  async execute() {
    const streamsCount = await this.streamRepository.getStreamsCount();

    return {
      message: 'success',
      count: streamsCount,
    };
  }
}
