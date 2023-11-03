import { Injectable } from '@nestjs/common';

import { KyselyService } from '../../../database/kysely.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly kysely: KyselyService) {}

  async getUserById(userId: number) {
    return await this.kysely.db
      .selectFrom('Profile')
      .selectAll()
      .where('userId', '=', userId)
      .executeTakeFirst();
  }

  async getPasswordByEmail(email: string) {
    return await this.kysely.db
      .selectFrom('User')
      .innerJoin('Password', 'Password.userId', 'User.id')
      .where('User.email', '=', email)
      .selectAll()
      .executeTakeFirst();
  }

  async getUserByEmail(email: string) {
    return this.kysely.db
      .selectFrom('User')
      .selectAll()
      .where('User.email', '=', email)
      .executeTakeFirst();
  }

  async getVerifyEmailByVerifyCode(verifyCode: string) {
    return await this.kysely.db
      .selectFrom('VerifyCode')
      .selectAll()
      .where('VerifyCode.code', '=', verifyCode)
      .where('VerifyCode.activate', '=', 1)
      .where('VerifyCode.type', '=', 'NEWACCOUNT')
      .executeTakeFirst();
  }

  // User Verify Status update
  async updateUserVerify(userId: number) {
    await this.kysely.db
      .updateTable('User')
      .where('id', '=', userId)
      .set({ verified: 1 })
      .executeTakeFirst();
  }

  // Verify Token update
  async updateVerifyToken(id: number) {
    await this.kysely.db
      .updateTable('VerifyCode')
      .set({ activate: 0, verifiedAt: new Date() })
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async createUserByEmail(name: string, email: string, hashedPassword: string) {
    return await this.kysely.db.transaction().execute(async (trx) => {
      const newUser = await trx
        .insertInto('User')
        .values({ email: email })
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('Password')
        .values({
          password: hashedPassword,
          userId: Number(newUser.insertId),
          updatedAt: new Date(),
        })
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('Profile')
        .values({
          name: name,
          userId: Number(newUser.insertId),
          updatedAt: new Date(),
        })
        .executeTakeFirst();

      return Number(newUser.insertId);
    });
  }

  async getRefreshToken(userId: number, refreshToken: string) {
    return await this.kysely.db
      .selectFrom('RefreshToken')
      .selectAll()
      .where('userId', '=', userId)
      .where('refreshToken', '=', refreshToken)
      .where('expiresIn', '>', new Date())
      .executeTakeFirst();
  }

  async saveRefreshToken(
    userId: number,
    refreshToken: string,
    ip: string,
    userAgent: string,
    fingerprint: string,
    expiresIn: Date,
  ) {
    await this.kysely.db
      .insertInto('RefreshToken')
      .values({
        refreshToken: refreshToken,
        activate: 1,
        ip: ip,
        fingerprint: fingerprint,
        userAgent: userAgent,
        expiresIn: expiresIn,
        userId: userId,
        updatedAt: new Date(),
      })
      .execute();
  }

  async updateRefreshToken(
    id: number,
    userId: number,
    refreshToken: string,
    ip: string,
    userAgent: string,
    fingerprint: string,
    expiresIn: Date,
  ) {
    await this.kysely.db
      .updateTable('RefreshToken')
      .set({
        refreshToken: refreshToken,
        ip: ip,
        userAgent: userAgent,
        fingerprint: fingerprint,
        expiresIn: expiresIn,
        updatedAt: new Date(),
      })
      .where('id', '=', id)
      .where('userId', '=', userId)
      .execute();
  }

  async disableRefreshToken(
    userId: number,
    refreshToken: string,
    ip: string,
    userAgent: string,
    fingerprint: string,
  ): Promise<void> {
    await this.kysely.db
      .updateTable('RefreshToken')
      .set({
        ip: ip,
        userAgent: userAgent,
        fingerprint: fingerprint,
        activate: 0,
        updatedAt: new Date(),
      })
      .where('userId', '=', userId)
      .where('refreshToken', '=', refreshToken)
      .execute();
  }
}
