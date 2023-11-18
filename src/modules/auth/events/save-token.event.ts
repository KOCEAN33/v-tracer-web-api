import { IEvent } from '@nestjs/cqrs';

export class SaveTokenEvent implements IEvent {
  constructor(
    readonly userId: number,
    readonly refreshToken: string,
    readonly ip: string,
    readonly userAgent: string,
    readonly expiresIn: Date,
  ) {}
}
