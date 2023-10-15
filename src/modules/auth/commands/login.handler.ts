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
  userData: {
    id: string;
    name: string;
    image?: string;
    isVerified?: boolean;
  };
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

    // reject login
    if (!user.isVerified) {
      throw new ForbiddenException('Your email is not verified');
    }

    if (user.image == null) {
      user.image = undefined;
    }

    // successful login logic
    const { accessToken, refreshToken } = this.tokenService.generateTokens({
      userId: user.id,
      name: user.name,
      image: user.image,
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
      sameSite: true,
      secure: process.env.NODE_ENV !== 'development',
    });

    const userData = {
      id: user.id,
      name: user.name,
      image: user.image,
    };

    return { message: 'Login Success', accessToken, userData };
  }
}
