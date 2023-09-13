import { IEvent } from '@nestjs/cqrs';
import { UserAgent } from '@prisma/client';

export class UpdateTokenEvent implements IEvent {
  constructor(
    readonly id: string,
    readonly refreshToken: string,
    readonly userAgent: UserAgent,
    readonly expiresIn: Date,
  ) {}
}
