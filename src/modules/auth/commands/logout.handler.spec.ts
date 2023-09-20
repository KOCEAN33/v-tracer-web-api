import { Test, TestingModule } from '@nestjs/testing';

import { AuthRepository } from '../repository/auth.repository';

import { UserAgentParser } from '../ua.service';
import { UserLogoutHandler } from './logout.handler';
import { UserLogoutCommand } from './logout.command';

describe('UserLogoutHandler', () => {
  let userLogoutHandler: UserLogoutHandler;
  let authRepository: AuthRepository;
  let userAgentParser: UserAgentParser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserLogoutHandler,
        {
          provide: AuthRepository,
          useValue: { disableRefreshToken: jest.fn() },
        },

        { provide: UserAgentParser, useValue: { parser: jest.fn() } },
      ],
    }).compile();

    userLogoutHandler = module.get<UserLogoutHandler>(UserLogoutHandler);
    authRepository = module.get<AuthRepository, jest.Mocked<AuthRepository>>(
      AuthRepository,
    );
    userAgentParser = module.get<UserAgentParser>(UserAgentParser);
  });

  it('should be an instanceof UserLogoutHandler', () => {
    expect(userLogoutHandler).toBeInstanceOf(UserLogoutHandler);
  });

  it('should delete refreshToken', async () => {
    const commandData = [
      {
        clearCookie: jest.fn(),
      } as any,
      'userId',
      'refreshToken',
      '127.0.0.1',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
      'fingerprint',
    ] as const;
    const parsedUserAgent = {
      IP: '127.0.0.1',
      OS: 'windows',
      browser: 'Firefox',
      fingerprint: 'fingerprint',
    };

    userAgentParser.parser = jest.fn().mockReturnValue(parsedUserAgent);

    const result = await userLogoutHandler.execute(
      new UserLogoutCommand(...commandData),
    );

    expect(result).toEqual({ message: 'success logout' });

    expect(authRepository.disableRefreshToken).toHaveBeenCalledWith(
      'userId',
      'refreshToken',
      parsedUserAgent,
    );
  });

  it('should return message when no refreshToken provided', async () => {
    const commandData = [
      {
        clearCookie: jest.fn(),
      } as any,
      'userId',
      null,
      '127.0.0.1',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
      'fingerprint',
    ] as const;

    const result = await userLogoutHandler.execute(
      new UserLogoutCommand(...commandData),
    );

    expect(result).toEqual({ message: 'Logout success' });
  });
});
