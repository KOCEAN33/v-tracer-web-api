import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../database/prisma.service';
import { User, AuthToken, VerifyEmailToken } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(name: string, email: string, hashedPassword: string) {
    return await this.prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });
  }

  async getUserById(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { email: email },
    });
  }

  async getUserByRefreshToken(refreshToken: string): Promise<AuthToken> {
    return await this.prisma.authToken.findUnique({
      where: {
        refreshToken: refreshToken,
      },
    });
  }

  async getVerifyEmailToken(
    userId: string,
    token: string,
  ): Promise<VerifyEmailToken[]> {
    return await this.prisma.verifyEmailToken.findMany({
      where: {
        userId: userId,
        token: token,
        type: 'NEWACCOUNT',
        isExpired: false,
        isVerified: false,
      },
    });
  }

  async updateUserVerifyByEmail(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });
  }

  async updateVerifyEmailToken(
    id: string,
    userId: string,
    token: string,
  ): Promise<void> {
    await this.prisma.verifyEmailToken.update({
      where: { id: id, userId: userId, token: token },
      data: { isExpired: true, isVerified: true, verifiedAt: new Date() },
    });
  }

  async saveRefreshToken(
    userId: string,
    refreshToken: string,
    ip: string,
    os: string,
    fingerprint: string,
    expiresIn: Date,
  ) {
    return await this.prisma.authToken.create({
      data: {
        userId: userId,
        fingerprint: fingerprint,
        ip: ip,
        os: os,
        refreshToken: refreshToken,
        expiresIn: expiresIn,
      },
    });
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string,
    ip: string,
    os: string,
    fingerprint: string,
    expiresIn: Date,
  ) {
    return await this.prisma.authToken.update({
      where: { id: id },
      data: {
        refreshToken: refreshToken,
        ip: ip,
        os: os,
        fingerprint: fingerprint,
        expiresIn: expiresIn,
      },
    });
  }
}
