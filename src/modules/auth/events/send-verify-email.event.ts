import { IEvent } from '@nestjs/cqrs';

export class SendVerifyEmailEvent implements IEvent {
  constructor(
    readonly userId: string,
    readonly email: string,
  ) {}
}
