import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetTotalStreamTimeQuery } from './get-total-stream-time.query';
import { StreamRepository } from '../repository/stream.repository';

@QueryHandler(GetTotalStreamTimeQuery)
export class GetTotalStreamTimeHandler
  implements IQueryHandler<GetTotalStreamTimeQuery>
{
  constructor(private readonly streamRepository: StreamRepository) {}

  async execute() {
    const totalStreamTime = await this.streamRepository.getTotalStreamTime();
    const convertHours = totalStreamTime / (60 * 60);

    return {
      message: 'success',
      totalHours: Math.round(convertHours),
    };
  }
}
