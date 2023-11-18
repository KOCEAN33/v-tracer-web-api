import { Injectable } from '@nestjs/common';

import { KyselyService } from '../../../database/kysely.service';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from '../../../@types';

@Injectable()
export class UserRepository {
  constructor(
    private readonly kysely: KyselyService,
    @InjectKysely() private readonly db: DB,
  ) {}

  async getProfileByUserId(userId: number) {
    return await this.db
      .selectFrom('profiles')
      .selectAll()
      .where('user_id', '=', userId)
      .executeTakeFirstOrThrow();
  }
}
