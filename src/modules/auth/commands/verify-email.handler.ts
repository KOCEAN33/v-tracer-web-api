import { ForbiddenException } from '@nestjs/common';
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

    // get the tokens from db
    const tokens = await this.authRepository.getVerifyEmailToken(
      userId,
      confirmationCode,
    );

    // check is tokens in db is variable
    if (!tokens) {
      throw new ForbiddenException('Invalid request');
    }
    if (tokens.length > 1) {
      throw new ForbiddenException('Something went wrong');
    }

    // check is token available
    const token = tokens[0];
    if (token.expiresIn <= new Date()) {
      throw new ForbiddenException('Invalid request');
    }

    // check verification token is valid
    if (token.token !== confirmationCode) {
      throw new ForbiddenException('Invalid request');
    }

    // update user & token status
    await Promise.all([
      await this.authRepository.updateVerifyEmailToken(
        token.id,
        userId,
        confirmationCode,
      ),
      await this.authRepository.updateUserVerifyByEmail(userId),
    ]);

    return 'success to verify your email';
  }
}
