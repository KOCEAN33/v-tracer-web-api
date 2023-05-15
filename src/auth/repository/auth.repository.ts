import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { User } from '@prisma/client';

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

  async saveToken(userId: string, accessToken: string, refreshToken: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { accessToken: accessToken, refreshToken: refreshToken },
    });
  }
}
