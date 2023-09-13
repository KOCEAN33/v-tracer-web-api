import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PasswordService } from '../password.service';
import { AuthRepository } from '../repository/auth.repository';
import { TokenService } from '../token.service';
import { UserLoginCommand } from './login.command';
import { SaveTokenEvent } from '../events/save-token.event';
import { UserAgentParser } from '../ua.service';

interface LoginResponse {
  message: string;
  accessToken?: string;
  userData: { id: string; name: string };
}

@CommandHandler(UserLoginCommand)
export class UserLoginHandler implements ICommandHandler<UserLoginCommand> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly eventBus: EventBus,
    private readonly userAgentParser: UserAgentParser,
  ) {}

  async execute(command: UserLoginCommand): Promise<LoginResponse> {
    const { email, password, response, ip, userAgent, fingerprint } = command;

    const user = await this.authRepository.getUserByEmailWithPassword(email);

    if (!user) {
      throw new BadRequestException('Invalid Username or Password');
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid Username or Password');
    }
    if (user.status === 'Unverified') {
      return {
        message: 'Unverified',
        userData: { id: user.id, name: user.name },
      };
    }

    // successful login logic
    if (user.status === 'Activated') {
      const { accessToken, refreshToken } = this.tokenService.generateTokens({
        userId: user.id,
      });

      const decodeJWT = this.jwtService.decode(refreshToken);
      const expiresIn = new Date(decodeJWT['exp'] * 1000);

      // save refreshToken
      const parsedUserAgent = this.userAgentParser.parser(
        userAgent,
        ip,
        fingerprint,
      );

      this.eventBus.publish(
        new SaveTokenEvent(user.id, refreshToken, parsedUserAgent, expiresIn),
      );

      response.clearCookie('token');
      response.cookie('token', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
      });

      const userData = {
        id: user.id,
        name: user.name,
      };

      return { message: 'Login Success', accessToken, userData };
    }
    throw new ForbiddenException('Your account can not authorize');
  }
}
