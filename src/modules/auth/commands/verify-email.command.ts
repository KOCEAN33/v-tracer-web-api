import { ICommand } from '@nestjs/cqrs';

export class UserVerifyEmailCommand implements ICommand {
  constructor(readonly verifyCode: string) {}
}
