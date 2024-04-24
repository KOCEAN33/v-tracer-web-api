import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RefreshTokenCommand } from './refresh-token.command';
import { TokenService } from '../token.service';
import { AuthRepository } from '../repository/auth.repository';
import { UpdateTokenEvent } from '../events/update-token.event';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RefreshTokenCommand) {
    const { receivedRefreshToken, response, ip, userAgent } = command;

    const payload =
      this.tokenService.extractUserIdFromToken(receivedRefreshToken);

    // If token is not valid or expired, trigger ERROR
    if (!payload) {
      throw new UnauthorizedException({
        message: 'please login again',
      });
    }

    const token = await this.authRepository.getRefreshToken(
      payload.userId,
      receivedRefreshToken,
    );

    if (!token) {
      throw new ForbiddenException('Access Denied');
    }

    // new token generation
    const { accessToken, refreshToken } = this.tokenService.generateTokens({
      userId: payload.userId,
      role: payload.role,
    });

    // get expired time
    const decodeJWT = this.jwtService.decode(refreshToken);
    const expiresIn = new Date(decodeJWT['exp'] * 1000);

    // update refreshToken to keep logged in
    this.eventBus.publish(
      new UpdateTokenEvent(
        token.id,
        token.user_id,
        refreshToken,
        ip,
        userAgent,
        expiresIn,
      ),
    );

    // Set Cookie
    response.clearCookie('token');
    response.cookie('token', refreshToken, {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV !== 'development',
    });

    return { accessToken };
  }
}
