import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthRepository } from '../repository/auth.repository';
import { TokenService } from '../token.service';

import { SaveTokenEvent } from '../events/save-token.event';
import { GenerateTokenCommand } from './generate-token.command';

interface LoginResponse {
  message: string;
  accessToken: string;
}

@CommandHandler(GenerateTokenCommand)
export class GenerateTokenHandler
  implements ICommandHandler<GenerateTokenCommand>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: GenerateTokenCommand): Promise<LoginResponse> {
    const {
      userId,
      provider,
      externalId,
      receivedAccessToken,
      ip,
      userAgent,
      response,
    } = command;

    const user = await this.authRepository.getUserByAccessToken(
      userId,
      provider,
      externalId,
      receivedAccessToken,
    );

    // reject login
    if (!user) {
      throw new ForbiddenException('can not verified');
    }

    // successful login logic
    const { accessToken, refreshToken } = this.tokenService.generateTokens({
      userId: user.user_id,
    });

    const decodeJWT = this.jwtService.decode(refreshToken);
    const expiresIn = new Date(decodeJWT['exp'] * 1000);

    this.eventBus.publish(
      new SaveTokenEvent(user.user_id, refreshToken, ip, userAgent, expiresIn),
    );

    response.clearCookie('token');
    response.cookie('token', refreshToken, {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV !== 'development',
    });

    return { message: 'token generated', accessToken };
  }
}
