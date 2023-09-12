import { ICommand } from '@nestjs/cqrs';

export class UserVerifyEmailCommand implements ICommand {
  constructor(
    readonly userId: string,
    readonly confirmationCode: string,
  ) {}
}
