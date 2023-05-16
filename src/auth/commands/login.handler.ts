import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';

import { PasswordService } from '../password.service';
import { Token, TokenService } from '../token.service';
import { AuthRepository } from '../repository/auth.repository';
import { UserLoginCommand } from './login.command';
import { SaveTokenEvent } from '../events/save-token.event';

@CommandHandler(UserLoginCommand)
export class UserLoginHandler implements ICommandHandler<UserLoginCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UserLoginCommand): Promise<Token> {
    const { email, password } = command;

    const user = await this.authRepository.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid Username or Password');
    }
    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid Username or Password');
    }

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens({ userId: user.id });
    this.eventBus.publish(
      new SaveTokenEvent(user.id, accessToken, refreshToken),
    );

    return { accessToken, refreshToken };
  }
}
