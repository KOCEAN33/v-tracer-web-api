import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthRepository } from '../repository/auth.repository';
import { UserVerifyEmailHandler } from './verify-email.handler';
import { UserVerifyEmailCommand } from './verify-email.command';
import { ForbiddenException } from '@nestjs/common';

describe('UserVerifyEmailHandler', () => {
  let userVerifyEmailHandler: UserVerifyEmailHandler;
  let authRepository: AuthRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserVerifyEmailHandler,
        {
          provide: AuthRepository,
          useValue: {
            getNewAccountVerifyEmailToken: jest.fn(),
            updateVerifyToken: jest.fn(),
            updateUserVerifyByEmail: jest.fn(),
          },
        },
        { provide: CommandBus, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    userVerifyEmailHandler = moduleRef.get<UserVerifyEmailHandler>(
      UserVerifyEmailHandler,
    );
    authRepository = moduleRef.get<AuthRepository, jest.Mocked<AuthRepository>>(
      AuthRepository,
    );
  });

  it('should be an instanceof UserVerifyEmailHandler', () => {
    expect(userVerifyEmailHandler).toBeInstanceOf(UserVerifyEmailHandler);
  });

  it('should update User & VerifyEmailToken', async () => {
    const today = new Date();
    const commandData = ['verifyUserId', 'verifyToken'] as const;
    const token = {
      id: 'tokenId',
      userId: 'verifyUserId',
      token: 'verifyToken',
      expiresIn: today.setHours(today.getHours() + 1),
    };

    authRepository.getNewAccountVerifyEmailToken = jest
      .fn()
      .mockResolvedValue(token);

    const result = await userVerifyEmailHandler.execute(
      new UserVerifyEmailCommand(...commandData),
    );

    expect(result).toEqual('success to verify your email');
    expect(authRepository.updateVerifyToken).toHaveBeenCalledWith(
      token.id,
      token.userId,
      'verifyToken',
    );
    expect(authRepository.updateUserVerifyByEmail).toHaveBeenCalledWith(
      'verifyUserId',
    );
  });

  it('should throw Forbidden error if no tokens are provided', async () => {
    const commandData = ['verifyUserId', 'verifyToken'] as const;

    authRepository.getNewAccountVerifyEmailToken = jest
      .fn()
      .mockResolvedValue(null);

    await expect(
      userVerifyEmailHandler.execute(
        new UserVerifyEmailCommand(...commandData),
      ),
    ).rejects.toThrow(new ForbiddenException('Invalid request'));
  });

  it('should throw Forbidden error if token expired', async () => {
    const commandData = ['verifyUserId', 'verifyToken'] as const;
    const today = new Date();
    const tokens = {
      id: 'tokenId',
      userId: 'verifyUserId',
      token: 'verifyToken',
      expiresIn: today.setHours(today.getHours() - 1),
    };

    authRepository.getNewAccountVerifyEmailToken = jest
      .fn()
      .mockResolvedValue(tokens);

    await expect(
      userVerifyEmailHandler.execute(
        new UserVerifyEmailCommand(...commandData),
      ),
    ).rejects.toThrow(new ForbiddenException('Invalid request'));
  });
});
