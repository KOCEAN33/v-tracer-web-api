import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from '../../../@types';

@Injectable()
export class StreamRepository {
  constructor(@InjectKysely() private readonly db: DB) {}

  async getTotalStreamTime(): Promise<number> {
    const totalDuration = await this.db
      .selectFrom('streams')
      .select((eb) => eb.fn.sum<number>('duration').as('total_duration'))
      .executeTakeFirst();
    return totalDuration.total_duration;
  }

  async getStreamsCount(): Promise<number> {
    const streamsCount = await this.db
      .selectFrom('streams')
      .select((eb) => eb.fn.count<number>('id').as('num_streams'))
      .where('duration', 'is not', null)
      .executeTakeFirst();
    return streamsCount.num_streams;
  }

  async getGameStreamRatio(): Promise<number> {
    const nonGameStream = await this.db
      .selectFrom('streams')
      .select((eb) => eb.fn.count<number>('game_id').as('num_streams'))
      .where('duration', 'is not', null)
      .executeTakeFirst();
    return nonGameStream.num_streams;
  }

  async getRecentStreams() {
    return this.db
      .selectFrom('streams')
      .select(['stream_id', 'streams.title as stream_title'])
      .where('is_finished', 'is not', null)
      .leftJoin('youtubes', 'youtubes.vtuber_id', 'streams.vtuber_id')
      .select(['youtubes.image'])
      .leftJoin('games', 'games.id', 'streams.game_id')
      .select(['games.title as game_title'])
      .limit(10)
      .execute();
  }
}
