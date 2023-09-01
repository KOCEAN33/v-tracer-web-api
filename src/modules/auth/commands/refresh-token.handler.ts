import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

import { RefreshTokenCommand } from './refresh-token.command';
import { AuthRepository } from '../repository/auth.repository';
import { TokenService } from '../token.service';

import { JwtService } from '@nestjs/jwt';
import { UAParser } from 'ua-parser-js';
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
    const { receivedRefreshToken, response, ip, userAgent, fingerprint } =
      command;

    const payload =
      this.tokenService.extractUserIdFromToken(receivedRefreshToken);

    // If token is not valid or expired, trigger ERROR
    if (!payload) {
      console.log('No Payload', payload);
      throw new UnauthorizedException({
        message: 'Failed renewal access-token ',
      });
    }

    const token =
      await this.authRepository.getUserByRefreshToken(receivedRefreshToken);

    if (!token) {
      console.log('No user with this refreshToken', token);
      throw new ForbiddenException('Access Denied');
    }

    if (payload.userId !== token.userId) {
      console.log('userId does not match');
      throw new ForbiddenException('Access Denied');
    }

    // new token generation
    const { accessToken, refreshToken } = this.tokenService.generateTokens({
      userId: payload.userId,
    });

    // get expired time
    const decodeJWT = this.jwtService.decode(refreshToken);
    const expiresIn = new Date(decodeJWT['exp'] * 1000);

    const parser = new UAParser(userAgent);
    const os = parser.getOS().name;

    // update refreshToken to keep logged in
    this.eventBus.publish(
      new UpdateTokenEvent(
        token.id,
        refreshToken,
        ip,
        os,
        fingerprint,
        expiresIn,
      ),
    );

    response.clearCookie('token');
    response.cookie('token', refreshToken, {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV !== 'development',
    });

    return { accessToken };
  }
}
