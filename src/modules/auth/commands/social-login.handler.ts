import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenService } from '../token.service';

import { SaveTokenEvent } from '../events/save-token.event';

import { SocialLoginCommand } from './social-login.command';
import { SocialAuthService } from '../social-auth.service';

@CommandHandler(SocialLoginCommand)
export class SocialLoginHandler implements ICommandHandler<SocialLoginCommand> {
  constructor(
    private readonly socialAuthService: SocialAuthService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SocialLoginCommand) {
    const { req, res, ip, userAgent } = command;

    const userData = await this.socialAuthService.socialAuthorization(req);

    // reject login
    if (!userData) {
      throw new ForbiddenException('can not verified');
    }

    // login fail logic
    if (userData == 'conflict') {
      const fail = {
        statusCode: HttpStatus.CONFLICT,
        message: 'this email is already in use',
      };
      res.write(
        `<script>window.opener.postMessage('${JSON.stringify(
          fail,
        )}', '*');window.close()</script>`,
      );
      return res.end();
    }

    // successful login logic
    const { accessToken, refreshToken } = this.tokenService.generateTokens({
      userId: userData.userId,
      role: userData.role,
    });

    const decodeJWT = this.jwtService.decode(refreshToken);
    const expiresIn = new Date(decodeJWT['exp'] * 1000);

    this.eventBus.publish(
      new SaveTokenEvent(
        userData.userId,
        refreshToken,
        ip,
        userAgent,
        expiresIn,
      ),
    );

    const token = {
      statusCode: HttpStatus.OK,
      message: 'login success',
      accessToken,
    };

    res.clearCookie('token');
    res.cookie('token', refreshToken, {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV !== 'development',
    });
    res.write(
      `<script>window.opener.postMessage('${JSON.stringify(
        token,
      )}', '*');window.close()</script>`,
    );

    return res.end();
  }
}
