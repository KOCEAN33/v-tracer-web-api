import { BadRequestException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UAParser } from 'ua-parser-js';

import { PasswordService } from '../password.service';
import { AuthRepository } from '../repository/auth.repository';
import { TokenService } from '../token.service';
import { UserLoginCommand } from './login.command';
import { SaveTokenEvent } from '../events/save-token.event';

import { JwtService } from '@nestjs/jwt';

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
    private readonly jwtService: JwtService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UserLoginCommand): Promise<LoginResponse> {
    const { email, password, response, ip, userAgent, fingerprint } = command;

    const parser = new UAParser(userAgent);
    const os = parser.getOS().name;

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

    const decodeJWT = this.jwtService.decode(refreshToken);
    const expiresIn = new Date(decodeJWT['exp'] * 1000);

    // save refreshToken
    this.eventBus.publish(
      new SaveTokenEvent(user.id, refreshToken, ip, os, fingerprint, expiresIn),
    );

    response.clearCookie('token');
    response.cookie('token', refreshToken, {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV !== 'development',
    });
    console.log(accessToken, refreshToken);
    const userData = {
      id: user.id,
      name: user.name,
    };

    return { accessToken, userData };
  }
}
