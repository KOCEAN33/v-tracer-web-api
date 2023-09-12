import { ICommand } from '@nestjs/cqrs';

export class SendVerifyEmailCommand implements ICommand {
  constructor(
    readonly userId: string,
    readonly email: string,
  ) {}
}
