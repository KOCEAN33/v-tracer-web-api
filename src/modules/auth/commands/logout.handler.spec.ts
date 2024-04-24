import { Test, TestingModule } from '@nestjs/testing';

import { AuthRepository } from '../repository/auth.repository';

import { UserLogoutHandler } from './logout.handler';
import { UserLogoutCommand } from './logout.command';

describe('UserLogoutHandler', () => {
  let userLogoutHandler: UserLogoutHandler;
  let authRepository: AuthRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserLogoutHandler,
        {
          provide: AuthRepository,
          useValue: { disableRefreshToken: jest.fn() },
        },
      ],
    }).compile();

    userLogoutHandler = module.get<UserLogoutHandler>(UserLogoutHandler);
    authRepository = module.get<AuthRepository, jest.Mocked<AuthRepository>>(
      AuthRepository,
    );
  });

  it('should be an instanceof UserLogoutHandler', () => {
    expect(userLogoutHandler).toBeInstanceOf(UserLogoutHandler);
  });

  it('should delete refreshToken', async () => {
    const commandData = [
      {
        clearCookie: jest.fn(),
      } as any,
      10,
      'refreshToken',
      '127.0.0.1',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
    ] as const;

    const result = await userLogoutHandler.execute(
      new UserLogoutCommand(...commandData),
    );

    expect(result).toEqual({ message: 'success logout' });

    expect(authRepository.disableRefreshToken).toHaveBeenCalledWith(
      10,
      'refreshToken',
      '127.0.0.1',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
    );
  });

  it('should return message when no refreshToken provided', async () => {
    const commandData = [
      {
        clearCookie: jest.fn(),
      } as any,
      10,
      null,
      '127.0.0.1',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
    ] as const;

    const result = await userLogoutHandler.execute(
      new UserLogoutCommand(...commandData),
    );

    expect(result).toEqual({ message: 'success logout' });
  });
});
