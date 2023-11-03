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
    const { verifyCode } = command;

    // get the tokens from db
    const verifyData =
      await this.authRepository.getVerifyEmailByVerifyCode(verifyCode);

    // check is tokens in db is variable
    if (!verifyData) {
      throw new ForbiddenException('Invalid request');
    }

    // check is token available
    if (verifyData.expiresIn <= new Date()) {
      throw new ForbiddenException('Invalid request');
    }

    // update user & token status
    await Promise.all([
      await this.authRepository.updateVerifyToken(verifyData.id),
      await this.authRepository.updateUserVerify(verifyData.userId),
    ]);

    return { message: 'success to verify your email' };
  }
}
