import { IEvent } from '@nestjs/cqrs';

export class UpdateTokenEvent implements IEvent {
  constructor(
    readonly userId: string,
    readonly accessToken: string,
    readonly refreshToken: string,
  ) {}
}
