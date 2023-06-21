import { Injectable } from '@nestjs/common';

import { User } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    name: string,
    handle: string,
    email: string,
    hashedPassword: string,
  ) {
    return await this.prisma.user.create({
      data: {
        name: name,
        handle: handle,
        email: email,
        password: hashedPassword,
      },
    });
  }

  async getUserById(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getUserByHandle(handle: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { handle: handle } });
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

  async createNewToken(
    userId: string,
    accessToken: string,
    refreshToken: string,
  ) {
    return await this.prisma.authToken.create({
      data: {
        userId: userId,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  }

  async updateToken(userId: string, accessToken: string, refreshToken: string) {
    return await this.prisma.authToken.update({
      where: { userId: userId },
      data: { accessToken: accessToken, refreshToken: refreshToken },
    });
  }

  async getTokenByUserId(userId: string) {
    const token = await this.prisma.authToken.findUnique({
      where: { userId: userId },
    });

    if (!token) {
      return null;
    }
    return token;
  }
}
