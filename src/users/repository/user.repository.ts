import { Injectable } from '@nestjs/common';

import { PrismaService } from 'nestjs-prisma';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async checkUserExists(emailAddress: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: emailAddress },
    });
    return user !== null;
  }

  async loginUser(email: string, password: string) {
    return await this.prisma.user.findFirst({
      where: { email: email, password: password },
    });
  }
}
