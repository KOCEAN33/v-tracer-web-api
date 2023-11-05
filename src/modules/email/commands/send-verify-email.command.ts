import { ICommand } from '@nestjs/cqrs';

export class SendVerifyEmailCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly email: string,
  ) {}
}
