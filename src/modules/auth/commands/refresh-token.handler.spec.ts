import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventBus } from '@nestjs/cqrs';

import { RefreshTokenCommand } from './refresh-token.command';
import { RefreshTokenHandler } from './refresh-token.handler';
import { AuthRepository } from '../repository/auth.repository';
import { UpdateTokenEvent } from '../events/update-token.event';
import { TokenService } from '../token.service';

const commandData = [
  'refresh-token',
  {
    clearCookie: jest.fn(),
    cookie: jest.fn(),
  } as any,
  '127.0.0.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
  'fingerprint',
] as const;

describe('RefreshTokenHandler', () => {
  let refreshTokenHandler: RefreshTokenHandler;
  let authRepository: AuthRepository;
  let tokenService: TokenService;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenHandler,
        {
          provide: AuthRepository,
          useValue: {
            getUserByRefreshToken: jest.fn(),
            getUserById: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            extractUserIdFromToken: jest.fn(),
            generateTokens: jest.fn(() => ({
              accessToken: 'fakeAccessToken',
              refreshToken: 'fakeRefreshToken',
            })),
          },
        },
        {
          provide: JwtService,
          useValue: {
            decode: jest.fn(() => ({
              exp: Math.floor(1693479600),
            })),
          },
        },
        { provide: EventBus, useValue: { publish: jest.fn() } },
      ],
    }).compile();

    refreshTokenHandler = module.get<RefreshTokenHandler>(RefreshTokenHandler);
    authRepository = module.get<AuthRepository, jest.Mocked<AuthRepository>>(
      AuthRepository,
    );
    tokenService = module.get<TokenService>(TokenService);
    eventBus = module.get<EventBus>(EventBus);
  });

  it('should be an instanceof RefreshTokenHandler', () => {
    expect(refreshTokenHandler).toBeInstanceOf(RefreshTokenHandler);
  });

  it('should refresh access and refresh tokens and publish UpdateTokenEvent', async () => {
    const payload = { userId: 10 };
    const mockUser = { id: 10, email: 'dev@example.com' };
    const token = { id: 9, userId: 10, activate: 1 };

    tokenService.extractUserIdFromToken = jest.fn().mockReturnValue(payload);
    authRepository.getRefreshToken = jest.fn().mockResolvedValue(token);
    authRepository.getUserById = jest.fn().mockResolvedValue(mockUser);

    const result = await refreshTokenHandler.execute(
      new RefreshTokenCommand(...commandData),
    );

    expect(result).toEqual({ accessToken: 'fakeAccessToken' });

    expect(eventBus.publish).toHaveBeenCalledWith(
      new UpdateTokenEvent(
        token.id,
        token.userId,
        'fakeRefreshToken',
        '127.0.0.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
        'fingerprint',
        new Date(1693479600 * 1000),
      ),
    );
  });

  it('should throw UnauthorizedException if user does not have refresh token or invalid token', async () => {
    tokenService.extractUserIdFromToken = jest.fn(() => null);

    await expect(
      refreshTokenHandler.execute(new RefreshTokenCommand(...commandData)),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw ForbiddenException if received refresh token does not match user refresh token in DB', async () => {
    const payload = { userId: 10 };
    tokenService.extractUserIdFromToken = jest.fn().mockReturnValue(payload);
    authRepository.getRefreshToken = jest.fn(() => null);

    await expect(
      refreshTokenHandler.execute(new RefreshTokenCommand(...commandData)),
    ).rejects.toThrow(ForbiddenException);
  });
});
