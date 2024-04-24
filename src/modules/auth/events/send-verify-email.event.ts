import { IEvent } from '@nestjs/cqrs';

export class SendVerifyEmailEvent implements IEvent {
  constructor(
    readonly userId: number,
    readonly email: string,
  ) {}
}
