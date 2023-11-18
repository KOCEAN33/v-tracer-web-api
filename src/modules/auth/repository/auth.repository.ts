import { Injectable } from '@nestjs/common';

import { KyselyService } from '../../../database/kysely.service';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from '../../../@types';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly kysely: KyselyService,
    @InjectKysely() private readonly db: DB,
  ) {}

  async getUserById(userId: number) {
    return await this.db
      .selectFrom('profiles')
      .selectAll()
      .where('user_id', '=', userId)
      .executeTakeFirst();
  }

  async getPasswordByEmail(email: string) {
    return await this.db
      .selectFrom('users')
      .innerJoin('passwords', 'passwords.user_id', 'users.id')
      .where('users.email', '=', email)
      .selectAll()
      .executeTakeFirst();
  }

  async getUserByEmail(email: string) {
    return this.db
      .selectFrom('users')
      .selectAll()
      .where('users.email', '=', email)
      .executeTakeFirst();
  }

  async getVerifyEmailByVerifyCode(verifyCode: string) {
    return await this.db
      .selectFrom('verify_codes')
      .selectAll()
      .where('verify_codes.code', '=', verifyCode)
      .where('verify_codes.is_activate', '=', 1)
      .where('verify_codes.type', '=', 'new_account')
      .executeTakeFirst();
  }

  // User Verify Status update
  async updateUserVerify(userId: number) {
    await this.db
      .updateTable('users')
      .where('id', '=', userId)
      .set({ is_verified: 1 })
      .executeTakeFirst();
  }

  // Verify Token update
  async updateVerifyToken(id: number) {
    await this.db
      .updateTable('verify_codes')
      .set({ is_activate: 0, verified_at: new Date() })
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async createUserByEmail(name: string, email: string, hashedPassword: string) {
    return await this.db.transaction().execute(async (trx) => {
      const newUser = await trx
        .insertInto('users')
        .values({ email: email })
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('passwords')
        .values({
          password: hashedPassword,
          user_id: Number(newUser.insertId),
          updated_at: new Date(),
        })
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('profiles')
        .values({
          name: name,
          user_id: Number(newUser.insertId),
          updated_at: new Date(),
        })
        .executeTakeFirst();

      return Number(newUser.insertId);
    });
  }

  async getRefreshToken(userId: number, refreshToken: string) {
    return await this.db
      .selectFrom('refresh_tokens')
      .selectAll()
      .where('user_id', '=', userId)
      .where('refresh_token', '=', refreshToken)
      .where('expires_in', '>', new Date())
      .executeTakeFirst();
  }

  async saveRefreshToken(
    userId: number,
    refreshToken: string,
    ip: string,
    userAgent: string,
    expiresIn: Date,
  ) {
    await this.db
      .insertInto('refresh_tokens')
      .values({
        refresh_token: refreshToken,
        is_activate: 1,
        ip: ip,
        user_agent: userAgent,
        expires_in: expiresIn,
        user_id: userId,
        updated_at: new Date(),
      })
      .execute();
  }

  async updateRefreshToken(
    id: number,
    userId: number,
    refreshToken: string,
    ip: string,
    userAgent: string,
    expiresIn: Date,
  ) {
    await this.db
      .updateTable('refresh_tokens')
      .set({
        refresh_token: refreshToken,
        ip: ip,
        user_agent: userAgent,
        expires_in: expiresIn,
        updated_at: new Date(),
      })
      .where('id', '=', id)
      .where('user_id', '=', userId)
      .execute();
  }

  async disableRefreshToken(
    userId: number,
    refreshToken: string,
    ip: string,
    userAgent: string,
  ): Promise<void> {
    await this.db
      .updateTable('refresh_tokens')
      .set({
        ip: ip,
        user_agent: userAgent,
        is_activate: 0,
        updated_at: new Date(),
      })
      .where('user_id', '=', userId)
      .where('refresh_token', '=', refreshToken)
      .execute();
  }
}
