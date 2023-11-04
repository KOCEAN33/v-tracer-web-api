import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';

import { AuthRepository } from '../repository/auth.repository';
import { UserVerifyEmailHandler } from './verify-email.handler';
import { UserVerifyEmailCommand } from './verify-email.command';

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
            getVerifyEmailByVerifyCode: jest.fn(),
            updateVerifyToken: jest.fn(),
            updateUserVerify: jest.fn(),
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
    const commandData = ['verifyToken'] as const;
    const verifyData = {
      id: 10,
      userId: 11,
      code: 'verifyToken',
      activate: 1,
    };

    authRepository.getVerifyEmailByVerifyCode = jest
      .fn()
      .mockResolvedValue(verifyData);

    const result = await userVerifyEmailHandler.execute(
      new UserVerifyEmailCommand(...commandData),
    );

    expect(result).toEqual({ message: 'success to verify your email' });
    expect(authRepository.updateVerifyToken).toHaveBeenCalledWith(
      verifyData.id,
    );
    expect(authRepository.updateUserVerify).toHaveBeenCalledWith(
      verifyData.userId,
    );
  });

  it('should throw Forbidden error if no validatable token are provided', async () => {
    const commandData = ['verifyToken'] as const;

    authRepository.getVerifyEmailByVerifyCode = jest
      .fn()
      .mockResolvedValue(null);

    await expect(
      userVerifyEmailHandler.execute(
        new UserVerifyEmailCommand(...commandData),
      ),
    ).rejects.toThrow(new ForbiddenException('Invalid request'));
  });
});
