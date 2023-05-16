import { Test } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { RefreshTokenCommand } from './refresh-token.command';
import { RefreshTokenHandler } from './refresh-token.handler';
import { AuthRepository } from '../repository/auth.repository';
import { TokenService } from '../token.service';
import { SaveTokenEvent } from '../events/save-token.event';

describe('RefreshTokenHandler', () => {
  let refreshTokenHandler: RefreshTokenHandler;
  let authRepository: AuthRepository;
  let tokenService: TokenService;
  let eventBus: EventBus;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RefreshTokenHandler,
        { provide: AuthRepository, useValue: {} },
        { provide: TokenService, useValue: {} },
        { provide: EventBus, useValue: {} },
      ],
    }).compile();

    refreshTokenHandler =
      moduleRef.get<RefreshTokenHandler>(RefreshTokenHandler);
    authRepository = moduleRef.get<AuthRepository>(AuthRepository);
    tokenService = moduleRef.get<TokenService>(TokenService);
    eventBus = moduleRef.get<EventBus>(EventBus);
  });

  it('should refresh access and refresh tokens and publish SaveTokenEvent', async () => {
    const command = new RefreshTokenCommand('1', 'valid_refresh_token');
    const user = { id: '1', refreshToken: 'valid_refresh_token' };
    const tokens = {
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token',
    };

    authRepository.getUserById = jest.fn().mockResolvedValue(user);
    tokenService.generateTokens = jest.fn().mockResolvedValue(tokens);
    eventBus.publish = jest.fn();

    const result = await refreshTokenHandler.execute(command);

    expect(result).toEqual(tokens);
    expect(authRepository.getUserById).toHaveBeenCalledWith('1');
    expect(tokenService.generateTokens).toHaveBeenCalledWith({
      userId: user.id,
    });
    expect(eventBus.publish).toHaveBeenCalledWith(
      new SaveTokenEvent(user.id, tokens.accessToken, tokens.refreshToken),
    );
  });

  it('should throw ForbiddenException if user does not exist or user does not have a refresh token', async () => {
    const command = new RefreshTokenCommand('1', 'valid_refresh_token');

    authRepository.getUserById = jest.fn().mockResolvedValue(null);

    await expect(refreshTokenHandler.execute(command)).rejects.toThrow(
      ForbiddenException,
    );
    expect(authRepository.getUserById).toHaveBeenCalledWith('1');
  });

  it('should throw ForbiddenException if received refresh token does not match user refresh token', async () => {
    const command = new RefreshTokenCommand('1', 'invalid_refresh_token');
    const user = { id: '1', refreshToken: 'valid_refresh_token' };

    authRepository.getUserById = jest.fn().mockResolvedValue(user);

    await expect(refreshTokenHandler.execute(command)).rejects.toThrow(
      ForbiddenException,
    );
    expect(authRepository.getUserById).toHaveBeenCalledWith('1');
  });
});
