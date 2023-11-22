import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthRepository } from '../repository/auth.repository';
import { TokenService } from '../token.service';

import { SaveTokenEvent } from '../events/save-token.event';
import { GenerateTokenCommand } from './generate-token.command';
import { GoogleLoginCommand } from './google-login.command';
import { SocialAuthService } from '../social-auth.service';

@CommandHandler(GoogleLoginCommand)
export class GoogleLoginHandler implements ICommandHandler<GoogleLoginCommand> {
  constructor(
    private readonly socialAuthService: SocialAuthService,
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: GoogleLoginCommand) {
    const { req, res, ip, userAgent } = command;

    // const user = await this.authRepository.getUserByAccessToken(
    //   userId,
    //   provider,
    //   externalId,
    //   receivedAccessToken,
    // );
    const userData = await this.socialAuthService.googleLogin(req);

    // reject login
    if (!userData) {
      throw new ForbiddenException('can not verified');
    }

    // successful login logic
    const { accessToken, refreshToken } = this.tokenService.generateTokens({
      userId: userData.userId,
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

    const token = { message: 'login success', accessToken };

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

    // return { message: 'token generated', accessToken };
    return { message: 'Google' };
  }
}
