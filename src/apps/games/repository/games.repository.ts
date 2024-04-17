import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from '../../../@types';

@Injectable()
export class GamesRepository {
  constructor(@InjectKysely() private readonly db: DB) {}

  async getPlayedGameRanking() {
    return await this.db
      .selectFrom('streams')
      .select(['game_id'])
      .groupBy(['game_id'])
      .select((eb) => eb.fn.sum<number>('duration').as('total_duration'))
      .where('game_id', 'is not', null)
      .orderBy('total_duration', 'desc')
      .leftJoin('games', 'games.id', 'streams.game_id')
      .select(['games.title'])
      .limit(15)
      .execute();
  }
}
