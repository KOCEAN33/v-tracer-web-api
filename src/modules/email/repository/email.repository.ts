import { Injectable } from '@nestjs/common';

import { InjectKysely } from 'nestjs-kysely';
import { DB } from '../../../@types';

@Injectable()
export class EmailRepository {
  constructor(@InjectKysely() private readonly db: DB) {}

  async createVerifyToken(
    userId: number,
    code: string,
    expiresIn: Date,
  ): Promise<void> {
    await this.db
      .insertInto('verify_codes')
      .values({
        code: code,
        is_activate: 1,
        type: 'new_account',
        expires_in: expiresIn,
        user_id: userId,
      })
      .execute();
  }

  async invalidateOldToken(userId: number): Promise<void> {
    await this.db
      .updateTable('verify_codes')
      .set({ is_activate: 0 })
      .where('user_id', '=', userId)
      .execute();
  }
}
