import { Injectable } from '@nestjs/common';

import { User, AuthToken } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

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
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async getUserIdbyRefreshToken(refreshToken: string): Promise<AuthToken> {
    return await this.prisma.authToken.findUnique({
      where: {
        refreshToken: refreshToken,
      },
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
