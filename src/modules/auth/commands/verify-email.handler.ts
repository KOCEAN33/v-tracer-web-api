import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AuthRepository } from '../repository/auth.repository';

import { UserVerifyEmailCommand } from './verify-email.command';
import { ForbiddenException } from '@nestjs/common';

@CommandHandler(UserVerifyEmailCommand)
export class UserVerifyEmailHandler
  implements ICommandHandler<UserVerifyEmailCommand>
{
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(command: UserVerifyEmailCommand) {
    const { userId, confirmationCode } = command;

    // TODO: check token status expiresIn
    const token = await this.authRepository.getVerifyEmailToken(
      userId,
      confirmationCode,
    );

    if (!token) {
      throw new ForbiddenException('Invalid request');
    }
    if (token.expiresIn >= new Date()) {
      throw new ForbiddenException('Invalid request');
    }

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
