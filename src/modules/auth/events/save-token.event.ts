import { IEvent } from '@nestjs/cqrs';
import { UserAgent } from '@prisma/client';

export class SaveTokenEvent implements IEvent {
  constructor(
    readonly userId: string,
    readonly refreshToken: string,
    readonly userAgent: UserAgent,
    readonly expiresIn: Date,
  ) {}
}
