import { IEvent } from '@nestjs/cqrs';

export class CreateNewTokenEvent implements IEvent {
  constructor(
    readonly userId: string,
    readonly accessToken: string,
    readonly refreshToken: string,
  ) {}
}
