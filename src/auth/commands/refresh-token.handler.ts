import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

import { AuthRepository } from '../../repository/auth.repository';

import { TokenService } from '../../token.service';

import { RefreshTokenCommand } from '../refresh-token.command';
import { UpdateTokenEvent } from '../../events/update-token.event';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RefreshTokenCommand) {
    const { receiveRefreshToken, response } = command;

    const payload =
      this.tokenService.extractUserIdFromToken(receiveRefreshToken);

    if (!payload) {
      // refresh token expired
      throw new UnauthorizedException({
        message: 'Failed renewal access-token ',
      });
    }

    const token = await this.authRepository.getTokenByUserId(payload.userId);

    if (!token) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await this.isRefreshTokenMatches(
      receiveRefreshToken,
      token.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens({
        userId: payload.userId,
      });

    this.eventBus.publish(
      new UpdateTokenEvent(payload.userId, accessToken, refreshToken),
    );

    response.clearCookie('token');
    response.cookie('token', refreshToken, {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV !== 'development',
    });

    return { accessToken };
  }

  private async isRefreshTokenMatches(
    refreshToken: string,
    userRefreshToken: string,
  ): Promise<boolean> {
    if (userRefreshToken === refreshToken) return true;
  }
}
