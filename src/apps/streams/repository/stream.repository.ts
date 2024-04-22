import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from '../../../@types';
import { ComparisonOperatorExpression } from 'kysely/dist/cjs/parser/binary-operation-parser';

@Injectable()
export class StreamRepository {
  constructor(@InjectKysely() private readonly db: DB) {}

  async getTotalStreamTime(
    oneMonthAgo: Date,
    operation: ComparisonOperatorExpression,
  ): Promise<number> {
    const totalDuration = await this.db
      .selectFrom('streams')
      .select((eb) => eb.fn.sum<number>('duration').as('total_duration'))
      .where('lived_at', operation, oneMonthAgo)
      .executeTakeFirst();
    return totalDuration.total_duration;
  }

  async getTotalStreamsCount(
    date: Date,
    operation: ComparisonOperatorExpression,
  ): Promise<number> {
    const count = await this.db
      .selectFrom('streams')
      .select((eb) => eb.fn.count<number>('duration').as('total_count'))
      .where('lived_at', operation, date)
      .executeTakeFirst();
    return count.total_count;
  }

  async getNonGameStreamsCount(
    oneMonthAgo: Date,
    op: ComparisonOperatorExpression,
  ): Promise<number> {
    const streamsCount = await this.db
      .selectFrom('streams')
      .select((eb) => eb.fn.count<number>('id').as('num_streams'))
      .where('duration', 'is not', null)
      .where('game_id', 'is', null)
      .where('lived_at', op, oneMonthAgo)
      .executeTakeFirst();
    return streamsCount.num_streams;
  }

  async getGameStreamCount(
    oneMonthAgo: Date,
    op: ComparisonOperatorExpression,
  ): Promise<number> {
    const nonGameStream = await this.db
      .selectFrom('streams')
      .select((eb) => eb.fn.count<number>('game_id').as('num_streams'))
      .where('duration', 'is not', null)
      .where('lived_at', op, oneMonthAgo)
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
      .orderBy('lived_at', 'desc')
      .limit(10)
      .execute();
  }
}
