import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from '../../../@types';

@Injectable()
export class UserRepository {
  constructor(@InjectKysely() private readonly db: DB) {}

  async getProfileByUserId(userId: number) {
    return await this.db
      .selectFrom('profiles')
      .select(['user_id', 'name', 'image_url'])
      .where('user_id', '=', userId)
      .executeTakeFirstOrThrow();
  }
}
