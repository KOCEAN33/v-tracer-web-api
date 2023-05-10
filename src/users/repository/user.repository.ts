import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveUser(name: string, email: string, password: string): Promise<User> {
    return await this.prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });
  }

  async checkUserExists(emailAddress: string) {
    const user = await this.prisma.user.findUnique({
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
