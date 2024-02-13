import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';

import { SendVerifyEmailCommand } from '../../email/commands/send-verify-email.command';
import { UserSignUpCommand } from './signup.command';
import { UserSignUpHandler } from './signup.handler';
import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from '../password.service';

describe('UserSignUpHandler', () => {
  let userSignUpHandler: UserSignUpHandler;
  let authRepository: AuthRepository;
  let eventBus: EventBus;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserSignUpHandler,
        {
          provide: AuthRepository,
          useValue: {
            getUserByEmail: jest.fn(),
            createUserByEmail: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: { hashPassword: jest.fn(() => ({})) },
        },
        { provide: EventBus, useValue: { publish: jest.fn() } },
      ],
    }).compile();

    userSignUpHandler = moduleRef.get<UserSignUpHandler>(UserSignUpHandler);
    authRepository = moduleRef.get<AuthRepository>(AuthRepository);
    eventBus = moduleRef.get<EventBus>(EventBus);
  });

  it('should be an instanceof UserSignUpHandler', () => {
    expect(userSignUpHandler).toBeInstanceOf(UserSignUpHandler);
  });

  it('should create a new user and send verification email', async () => {
    const commandData = ['xanny', 'dev@xanny.us', 'passw0rd'] as const;
    const checkUser = null;
    const newUser = 10;

    authRepository.getUserByEmail = jest.fn().mockResolvedValue(checkUser);
    authRepository.createUserByEmail = jest.fn().mockResolvedValue(newUser);

    const result = await userSignUpHandler.execute(
      new UserSignUpCommand(...commandData),
    );

    expect(result).toEqual({ message: 'please verify your email' });
    expect(eventBus.publish).toHaveBeenCalledWith(
      new SendVerifyEmailCommand(newUser, 'dev@xanny.us'),
    );
  });

  it('should throw ConflictException when email is duplicated', async () => {
    const commandData = ['xanny', 'dev@xanny.us', 'passw0rd'] as const;
    const checkUser = 'dev@xanny.us';

    authRepository.getUserByEmail = jest.fn().mockResolvedValue(checkUser);

    await expect(
      userSignUpHandler.execute(new UserSignUpCommand(...commandData)),
    ).rejects.toThrow(ConflictException);
  });
});
