import { ICommand } from '@nestjs/cqrs';

export class UserSignUpCommand implements ICommand {
  constructor(
    readonly name: string,
    readonly handle: string,
    readonly email: string,
    readonly password: string,
  ) {}
}
