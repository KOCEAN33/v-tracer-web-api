import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException } from '@nestjs/common';

import { AuthRepository } from '../../repository/auth.repository';

import { Token, TokenService } from '../../token.service';

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

  async execute(command: RefreshTokenCommand): Promise<Token> {
    const { userId, receiveRefreshToken } = command;

    const token = await this.authRepository.getTokenByUserId(userId);

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
      await this.tokenService.generateTokens({ userId: userId });

    this.eventBus.publish(
      new UpdateTokenEvent(userId, accessToken, refreshToken),
    );

    return { accessToken, refreshToken };
  }

  private async isRefreshTokenMatches(
    refreshToken: string,
    userRefreshToken: string,
  ): Promise<boolean> {
    if (userRefreshToken === refreshToken) return true;
  }
}
