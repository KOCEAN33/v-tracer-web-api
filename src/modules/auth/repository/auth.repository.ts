import { Injectable } from '@nestjs/common';
import { User, VerifyToken, UserAgent, AuthToken } from '@prisma/client';

import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getUserByEmailWithPassword(email: string) {
    return await this.prisma.user.findUnique({
      where: { email: email },
      include: { password: { select: { password: true } } },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  async getVerifyEmailByVerifyCode(verifyCode: string) {
    return await this.prisma.verifyToken.findFirst({
      where: {
        type: 'NewAccount',
        code: verifyCode,
        isVerifiable: true,
      },
    });
  }

  async updateUserVerifyByEmail(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: 'Activated', isVerified: true },
    });
  }

  async updateVerifyToken(id: string): Promise<void> {
    await this.prisma.verifyToken.update({
      where: { id: id },
      data: { isVerifiable: false, verifiedAt: new Date() },
    });
  }

  async createUserByEmail(name: string, email: string, hashedPassword: string) {
    return await this.prisma.user.create({
      data: {
        name: name,
        email: email,
        status: 'Unverified',
        password: { create: { password: hashedPassword } },
      },
    });
  }

  async getRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<AuthToken> {
    const token = await this.prisma.user.findFirst({
      where: { id: userId, isVerified: true },
      include: {
        authToken: {
          where: {
            refreshToken: refreshToken,
            isActivated: true,
            expiresIn: { gte: new Date() },
          },
        },
      },
    });
    return token.authToken[0];
  }

  async saveRefreshToken(
    userId: string,
    refreshToken: string,
    userAgent: UserAgent,
    expiresIn: Date,
  ): Promise<void> {
    await this.prisma.authToken.create({
      data: {
        userId: userId,
        refreshToken: refreshToken,
        creationUA: userAgent,
        latestUA: userAgent,
        expiresIn: expiresIn,
        isActivated: true,
      },
    });
  }

  // TODO: fix DB schema, it should be update refreshToken even UA data doesn't exist
  async updateRefreshToken(
    id: string,
    refreshToken: string,
    userAgent: UserAgent,
    expiresIn: Date,
  ): Promise<void> {
    await this.prisma.authToken.update({
      where: { id: id },
      data: {
        refreshToken: refreshToken,
        latestUA: userAgent,
        expiresIn: expiresIn,
        isActivated: true,
      },
    });
  }

  async disableRefreshToken(
    userId: string,
    refreshToken: string,
    userAgent: UserAgent,
  ): Promise<void> {
    await this.prisma.authToken.update({
      where: { userId: userId, refreshToken: refreshToken },
      data: { latestUA: userAgent, isActivated: false },
    });
  }
}
