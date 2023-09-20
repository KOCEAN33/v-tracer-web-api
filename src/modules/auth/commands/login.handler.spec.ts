import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventBus } from '@nestjs/cqrs';

import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from '../password.service';
import { TokenService } from '../token.service';

import { UserLoginHandler } from './login.handler';
import { UserLoginCommand } from './login.command';
import { SaveTokenEvent } from '../events/save-token.event';
import { UserAgentParser } from '../ua.service';

describe('UserLoginHandler', () => {
  let userLoginHandler: UserLoginHandler;
  let authRepository: AuthRepository;
  let passwordService: PasswordService;
  let eventBus: EventBus;
  let userAgentParser: UserAgentParser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserLoginHandler,
        {
          provide: AuthRepository,
          useValue: {
            getUserByEmailWithPassword: jest.fn(),
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
        { provide: UserAgentParser, useValue: { parser: jest.fn() } },
      ],
    }).compile();

    userLoginHandler = module.get<UserLoginHandler>(UserLoginHandler);
    authRepository = module.get<AuthRepository>(AuthRepository);
    passwordService = module.get<PasswordService>(PasswordService);
    eventBus = module.get<EventBus>(EventBus);
    userAgentParser = module.get<UserAgentParser>(UserAgentParser);
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
      id: 'userId',
      name: 'John',
      status: 'Activated',
      imageSrc: 'imageUrl',
      isVerified: true,
      password: { password: 'hashedPassword' },
    };
    const parsedUserAgent = {
      IP: '127.0.0.1',
      OS: 'windows',
      browser: 'Firefox',
      fingerprint: 'fingerprint',
    };
    authRepository.getUserByEmailWithPassword = jest
      .fn()
      .mockResolvedValue(mockUser);
    passwordService.validatePassword = jest.fn().mockResolvedValue(true);
    userAgentParser.parser = jest.fn().mockReturnValue(parsedUserAgent);

    const result = await userLoginHandler.execute(
      new UserLoginCommand(...commandData),
    );

    expect(result).toEqual({
      accessToken: 'fakeAccessToken',
      message: 'Login Success',
      userData: { id: 'userId', name: 'John', imageSrc: 'imageUrl' },
    });
    expect(eventBus.publish).toHaveBeenCalledWith(
      new SaveTokenEvent(
        'userId',
        'fakeRefreshToken',
        parsedUserAgent,
        new Date(1693479600 * 1000),
      ),
    );
  });

  it('should return alarm when user does not verified', async () => {
    const commandData = [
      'test@example.com',
      'password',
      { clearCookie: jest.fn(), cookie: jest.fn() } as any,
      '127.0.0.1',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
      'fingerprint',
    ] as const;
    const mockUser = {
      id: 'userId',
      name: 'John',
      status: 'Unverified',
      isVerified: false,
      password: { password: 'hashedPassword' },
    };

    authRepository.getUserByEmailWithPassword = jest
      .fn()
      .mockResolvedValue(mockUser);
    passwordService.validatePassword = jest.fn().mockResolvedValue(true);

    const result = await userLoginHandler.execute(
      new UserLoginCommand(...commandData),
    );

    expect(result).toEqual({
      message: 'Your account is not verified',
      userData: { id: 'userId', name: 'John', isVerified: false },
    });
  });

  it('should throw BadRequestException if user does not exist', async () => {
    const commandData = [
      'test@example.com',
      'password',
      { clearCookie: jest.fn(), cookie: jest.fn() } as any,
      '127.0.0.1',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
      'fingerprint',
    ] as const;
    authRepository.getUserByEmailWithPassword = jest.fn(() => null);

    await expect(
      userLoginHandler.execute(new UserLoginCommand(...commandData)),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if password is not equal', async () => {
    const commandData = [
      'test@example.com',
      'password',
      { clearCookie: jest.fn(), cookie: jest.fn() } as any,
      '127.0.0.1',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
      'fingerprint',
    ] as const;
    const mockUser = {
      id: 'userId',
      name: 'John',
      password: { password: 'hashedPassword' },
    };
    authRepository.getUserByEmail = jest.fn().mockResolvedValue(mockUser);
    passwordService.validatePassword = jest.fn().mockResolvedValue(false);

    await expect(
      userLoginHandler.execute(new UserLoginCommand(...commandData)),
    ).rejects.toThrow(BadRequestException);
  });
});
