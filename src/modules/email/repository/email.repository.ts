import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class EmailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveVerifyToken(
    userId: string,
    email: string,
    token: string,
    expiresIn: Date,
  ): Promise<void> {
    await this.prisma.verifyEmailToken.create({
      data: {
        type: 'NEWACCOUNT',
        userId: userId,
        email: email,
        token: token,
        isVerified: false,
        isExpired: false,
        expiresIn: expiresIn,
      },
    });
  }

  async invalidateOldToken(userId: string): Promise<void> {
    await this.prisma.verifyEmailToken.updateMany({
      where: { userId: userId, isExpired: false },
      data: { isExpired: true },
    });
  }
}
