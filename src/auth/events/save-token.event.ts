import { IEvent } from '@nestjs/cqrs';

export class SaveTokenEvent implements IEvent {
  constructor(
    readonly userId: string,
    readonly accessToken: string,
    readonly refreshToken: string,
  ) {}
}
