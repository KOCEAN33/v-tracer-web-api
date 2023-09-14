import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class EmailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createVerifyToken(
    userId: string,
    email: string,
    token: string,
    expiresIn: Date,
  ): Promise<void> {
    await this.prisma.verifyToken.create({
      data: {
        type: 'NewAccount',
        userId: userId,
        email: email,
        token: token,
        isVerifiable: true,
        expiresIn: expiresIn,
      },
    });
  }

  async invalidateOldToken(userId: string): Promise<void> {
    await this.prisma.verifyToken.updateMany({
      where: { userId: userId },
      data: { isVerifiable: false },
    });
  }

  async updateUserStatusEmailNotExist(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: 'NoEmailExist' },
    });
  }
}
