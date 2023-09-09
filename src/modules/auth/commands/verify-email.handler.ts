import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AuthRepository } from '../repository/auth.repository';

import { UserVerifyEmailCommand } from './verify-email.command';

@CommandHandler(UserVerifyEmailCommand)
export class UserVerifyEmailHandler
  implements ICommandHandler<UserVerifyEmailCommand>
{
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(command: UserVerifyEmailCommand) {
    const { userId, confirmationCode } = command;
  }
}
