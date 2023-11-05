import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventBus } from '@nestjs/cqrs';

import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from '../password.service';
import { TokenService } from '../token.service';

import { UserLoginHandler } from './login.handler';
import { UserLoginCommand } from './login.command';
import { SaveTokenEvent } from '../events/save-token.event';

describe('UserLoginHandler', () => {
  let userLoginHandler: UserLoginHandler;
  let authRepository: AuthRepository;
  let passwordService: PasswordService;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserLoginHandler,
        {
          provide: AuthRepository,
          useValue: {
            getPasswordByEmail: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            validatePassword: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
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
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    userLoginHandler = module.get<UserLoginHandler>(UserLoginHandler);
    authRepository = module.get<AuthRepository>(AuthRepository);
    passwordService = module.get<PasswordService>(PasswordService);
    eventBus = module.get<EventBus>(EventBus);
  });

  it('should be an instanceof UserLoginHandler', () => {
    expect(userLoginHandler).toBeInstanceOf(UserLoginHandler);
  });

  it('should return access token and user data on successful login', async () => {
    const commandData = [
      'test@example.com',
      'password',
      { clearCookie: jest.fn(), cookie: jest.fn() } as any,
      '127.0.0.1',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
      'fingerprint',
    ] as const;
    const mockUser = {
      id: 10,
      name: 'dev@example.com',
      verified: 1,
      userId: 11,
      password: 'hashedPassword',
    };

    authRepository.getPasswordByEmail = jest.fn().mockResolvedValue(mockUser);
    passwordService.validatePassword = jest.fn().mockResolvedValue(true);

    const result = await userLoginHandler.execute(
      new UserLoginCommand(...commandData),
    );

    expect(result).toEqual({
      message: 'Login Success',
      accessToken: 'fakeAccessToken',
    });
    expect(eventBus.publish).toHaveBeenCalledWith(
      new SaveTokenEvent(
        11,
        'fakeRefreshToken',
        '127.0.0.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
        'fingerprint',
        new Date(1693479600 * 1000),
      ),
    );
  });

  it('should return ForbiddenException when user email does not verified', async () => {
    const commandData = [
      'dev@example.com',
      'password',
      { clearCookie: jest.fn(), cookie: jest.fn() } as any,
      '127.0.0.1',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
      'fingerprint',
    ] as const;
    const mockUser = {
      id: 10,
      name: 'dev@example.com',
      verified: 0,
      userId: 11,
      password: 'hashedPassword',
    };

    authRepository.getPasswordByEmail = jest.fn().mockResolvedValue(mockUser);
    passwordService.validatePassword = jest.fn().mockResolvedValue(true);

    expect(
      userLoginHandler.execute(new UserLoginCommand(...commandData)),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw BadRequestException if user does not exist', async () => {
    const commandData = [
      'dev@example.com',
      'password',
      { clearCookie: jest.fn(), cookie: jest.fn() } as any,
      '127.0.0.1',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
      'fingerprint',
    ] as const;
    authRepository.getPasswordByEmail = jest.fn(() => null);

    await expect(
      userLoginHandler.execute(new UserLoginCommand(...commandData)),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if password is not equal', async () => {
    const commandData = [
      'dev@example.com',
      'password',
      { clearCookie: jest.fn(), cookie: jest.fn() } as any,
      '127.0.0.1',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
      'fingerprint',
    ] as const;
    const mockUser = {
      id: 10,
      name: 'dev@example.com',
      verified: 0,
      userId: 11,
      password: 'hashedPassword',
    };
    authRepository.getUserByEmail = jest.fn().mockResolvedValue(mockUser);
    passwordService.validatePassword = jest.fn().mockResolvedValue(false);

    await expect(
      userLoginHandler.execute(new UserLoginCommand(...commandData)),
    ).rejects.toThrow(BadRequestException);
  });
});
