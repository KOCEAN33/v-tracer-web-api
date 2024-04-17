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
}
