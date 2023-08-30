import { IEvent } from '@nestjs/cqrs';

export class UpdateTokenEvent implements IEvent {
  constructor(
    readonly id: string,
    readonly refreshToken: string,
    readonly ip: string,
    readonly os: string,
    readonly fingerprint: string,
    readonly expiresIn: Date,
  ) {}
}
