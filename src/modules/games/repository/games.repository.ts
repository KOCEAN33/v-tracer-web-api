import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from '../../../@types';

@Injectable()
export class GamesRepository {
  constructor(@InjectKysely() private readonly db: DB) {}

  async getPlayedGameRanking() {
    return await this.db
      .selectFrom('streams')
      .select((eb) => eb.fn.sum<number>('duration').as('total_duration'))
      .select(['game_id'])
      .where('game_id', 'is not', null)
      .groupBy(['game_id'])
      .orderBy('total_duration', 'desc')
      .leftJoin('games', 'games.id', 'streams.game_id')
      .select(['games.title'])
      .limit(15)
      .execute();
  }
}
