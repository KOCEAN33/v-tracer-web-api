import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from '../password.service';
import { Token, TokenService } from '../token.service';
import { UserSignUpCommand } from './signup.command';

@Injectable()
@CommandHandler(UserSignUpCommand)
export class UserSignUpHandler implements ICommandHandler<UserSignUpCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: UserSignUpCommand): Promise<Token> {
    const { name, email, password } = command;

    const hashedPassword = await this.passwordService.hashPassword(password);
    const isUserExist = await this.authRepository.getUserByEmail(email);
    if (isUserExist !== null) {
      throw new UnprocessableEntityException(`Email ${email} already used.`);
    }

    const user = await this.authRepository.createUser(
      name,
      email,
      hashedPassword,
    );

    return this.tokenService.generateTokens({ userId: user.id });
  }
}
