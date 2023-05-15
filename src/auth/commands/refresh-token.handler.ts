import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from '../password.service';
import { Token, TokenService } from '../token.service';

import { RefreshTokenCommand } from './refresh-token.command';
import { SaveTokenEvent } from '../events/save-token.event';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<Token> {
    const { userId, receiveRefreshToken } = command;

    const user = await this.repository.getUserById(userId);
    console.log(user);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    const refreshTokenMatches = await this.isRefreshTokenMatches(
      receiveRefreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens({ userId: user.id });

    this.eventBus.publish(
      new SaveTokenEvent(user.id, accessToken, refreshToken),
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
