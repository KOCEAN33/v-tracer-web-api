import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetVtuberCountQuery } from './get-vtuber-count.query';
import { VtuberRepository } from '../repository/vtuber.repository';

@QueryHandler(GetVtuberCountQuery)
export class GetVtuberCountHandler
  implements IQueryHandler<GetVtuberCountQuery>
{
  constructor(private readonly vtuberRepository: VtuberRepository) {}

  async execute() {
    const vtuberCount = await this.vtuberRepository.getVtuberCount();

    return {
      message: 'success',
      count: vtuberCount,
    };
  }
}
