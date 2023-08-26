import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';

import { PasswordService } from '../../password.service';
import { TokenService } from '../../token.service';
import { AuthRepository } from '../../repository/auth.repository';
import { UserLoginCommand } from '../login.command';
import { UpdateTokenEvent } from '../../events/update-token.event';

interface LoginResponse {
  accessToken: string;
  userData: { id: string; name: string };
}

@CommandHandler(UserLoginCommand)
export class UserLoginHandler implements ICommandHandler<UserLoginCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UserLoginCommand): Promise<LoginResponse> {
    const { email, password, response } = command;

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

    const { accessToken, refreshToken } = this.tokenService.generateTokens({
      userId: user.id,
    });

    response.clearCookie('token');
    response.cookie('token', refreshToken, {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV !== 'development',
    });

    const userData = {
      id: user.id,
      name: user.name,
    };

    this.eventBus.publish(
      new UpdateTokenEvent(user.id, accessToken, refreshToken),
    );

    return { accessToken, userData };
  }
}
