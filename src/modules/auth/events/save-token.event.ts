import { IEvent } from '@nestjs/cqrs';

export class SaveTokenEvent implements IEvent {
  constructor(
    readonly userId: string,
    readonly refreshToken: string,
    readonly ip: string,
    readonly os: string,
    readonly fingerprint: string,
    readonly expiresIn: Date,
  ) {}
}
