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
    const token = await this.authRepository.getNewAccountVerifyEmailToken(
      userId,
      confirmationCode,
    );

    // check is tokens in db is variable
    if (!token) {
      throw new ForbiddenException('Invalid request');
    }

    // check is token available
    if (token.expiresIn <= new Date()) {
      throw new ForbiddenException('Invalid request');
    }

    // update user & token status
    await Promise.all([
      await this.authRepository.updateVerifyToken(
        token.id,
        userId,
        confirmationCode,
      ),
      await this.authRepository.updateUserVerifyByEmail(userId),
    ]);

    return 'success to verify your email';
  }
}
