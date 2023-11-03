import { Injectable } from '@nestjs/common';

import { KyselyService } from '../../../database/kysely.service';

@Injectable()
export class UserRepository {
  constructor(private readonly kysely: KyselyService) {}

  async getProfileByUserId(userId: number) {
    return await this.kysely.db
      .selectFrom('Profile')
      .selectAll()
      .where('userId', '=', userId)
      .executeTakeFirstOrThrow();
  }
}
