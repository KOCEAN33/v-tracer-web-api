import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { StreamRepository } from '../repository/stream.repository';
import { GetRecentStreamsQuery } from './get-recent-streams.query';

@QueryHandler(GetRecentStreamsQuery)
export class GetRecentStreamsHandler
  implements IQueryHandler<GetRecentStreamsQuery>
{
  constructor(private readonly streamRepository: StreamRepository) {}

  async execute() {
    const recentStreams = await this.streamRepository.getRecentStreams();
    return recentStreams.map((recentStream) => {
      return {
        streamId: recentStream.stream_id,
        streamTitle: this.removeAngle(recentStream.stream_title),
        image: recentStream.image,
        gameTitle: recentStream.game_title,
      };
    });
  }

  private removeAngle(text: string): string {
    return text.replace(/【[^】]*】/g, '');
  }
}
