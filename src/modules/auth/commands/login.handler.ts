import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PasswordService } from '../password.service';
import { AuthRepository } from '../repository/auth.repository';
import { TokenService } from '../token.service';
import { UserLoginCommand } from './login.command';
import { SaveTokenEvent } from '../events/save-token.event';

interface LoginResponse {
  message: string;
  accessToken: string;
}

@CommandHandler(UserLoginCommand)
export class UserLoginHandler implements ICommandHandler<UserLoginCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UserLoginCommand): Promise<LoginResponse> {
    const { email, password, response, ip, userAgent, fingerprint } = command;

    const user = await this.authRepository.getPasswordByEmail(email);

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

    // reject login
    if (!user.verified) {
      throw new ForbiddenException('Your not verified');
    }

    // successful login logic
    const { accessToken, refreshToken } = this.tokenService.generateTokens({
      userId: user.userId,
    });

    const decodeJWT = this.jwtService.decode(refreshToken);
    const expiresIn = new Date(decodeJWT['exp'] * 1000);

    this.eventBus.publish(
      new SaveTokenEvent(
        user.userId,
        refreshToken,
        ip,
        userAgent,
        fingerprint,
        expiresIn,
      ),
    );

    response.clearCookie('token');
    response.cookie('token', refreshToken, {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV !== 'development',
    });

    return { message: 'Login Success', accessToken };
  }
}
