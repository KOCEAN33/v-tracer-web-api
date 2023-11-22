import { Injectable } from '@nestjs/common';

import { InjectKysely } from 'nestjs-kysely';
import { DB } from '../../../@types';

@Injectable()
export class AuthRepository {
  constructor(@InjectKysely() private readonly db: DB) {}

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

  async createSocialAccount(
    email: string,
    firstName: string,
    lastName: string,
    picture: string,
    provider: string,
    externalId: string,
    accessToken: string,
    refreshToken: string,
  ) {
    return await this.db.transaction().execute(async (trx) => {
      const newUser = await trx
        .insertInto('users')
        .values({ email: email, is_verified: 1 })
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('social_logins')
        .values({
          provider: provider,
          external_id: externalId,
          email: email,
          first_name: firstName,
          last_name: lastName,
          picture: picture,
          access_token: accessToken,
          refresh_token: refreshToken,
          user_id: Number(newUser.insertId),
          updated_at: new Date(),
        })
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('profiles')
        .values({
          name: lastName + firstName,
          image_url: picture,
          user_id: Number(newUser.insertId),
          updated_at: new Date(),
        })
        .executeTakeFirst();

      return Number(newUser.insertId);
    });
  }

  async updateSocialAuth(
    userId: number,
    externalId: string,
    accessToken: string,
    socId: string,
  ) {
    return await this.db
      .updateTable('social_logins')
      .set({ access_token: accessToken })
      .where('user_id', '=', userId)
      .where('external_id', '=', externalId)
      .where('provider', '=', socId)
      .executeTakeFirst();
  }

  async getUserBySocialId(socialId: string) {
    return await this.db
      .selectFrom('social_logins')
      .select(['user_id', 'external_id', 'provider'])
      .where('external_id', '=', socialId)
      .executeTakeFirst();
  }

  async getUserByAccessToken(
    userId: number,
    socId: string,
    externalId: string,
    accessToken: string,
  ) {
    return await this.db
      .selectFrom('social_logins')
      .select(['user_id', 'provider', 'external_id', 'access_token'])
      .where('user_id', '=', userId)
      .where('provider', '=', socId)
      .where('external_id', '=', externalId)
      .where('access_token', '=', accessToken)
      .executeTakeFirst();
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
