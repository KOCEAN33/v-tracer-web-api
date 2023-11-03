import { Injectable } from '@nestjs/common';

import { KyselyService } from '../../../database/kysely.service';

@Injectable()
export class EmailRepository {
  constructor(private readonly kysely: KyselyService) {}

  async createVerifyToken(
    userId: number,
    code: string,
    expiresIn: Date,
  ): Promise<void> {
    await this.kysely.db
      .insertInto('VerifyCode')
      .values({
        code: code,
        activate: 1,
        type: 'NEWACCOUNT',
        expiresIn: expiresIn,
        userId: userId,
      })
      .execute();
  }

  async invalidateOldToken(userId: number): Promise<void> {
    await this.kysely.db
      .updateTable('VerifyCode')
      .set({ activate: 0 })
      .where('userId', '=', userId)
      .execute();
  }
}
