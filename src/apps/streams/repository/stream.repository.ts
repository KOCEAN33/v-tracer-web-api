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

  async addNewCompany() {}
}
