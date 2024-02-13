import { IEvent } from '@nestjs/cqrs';

export class UpdateTokenEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly userId: number,
    readonly refreshToken: string,
    readonly ip: string,
    readonly userAgent: string,
    readonly expiresIn: Date,
  ) {}
}
