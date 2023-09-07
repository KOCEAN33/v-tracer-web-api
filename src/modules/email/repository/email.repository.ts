import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class EmailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveVerifyToken(
    userId: string,
    email: string,
    uuid: string,
    expiresIn: Date,
  ) {
    return await this.prisma.verifyEmail.create({
      data: {
        type: 'NEWACCOUNT',
        userId: userId,
        email: email,
        uuid: uuid,
        verified: false,
        expired: false,
        expiresIn: expiresIn,
      },
    });
  }
}
