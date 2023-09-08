import { Test, TestingModule } from '@nestjs/testing';

import { UserSignUpCommand } from './signup.command';
import { UserSignUpHandler } from './signup.handler';
import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from '../password.service';

import { CommandBus } from '@nestjs/cqrs';

import { VerifyEmailCommand } from '../../email/commands/verify-email.command';
import {
  ConflictException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

describe('UserSignUpHandler', () => {
  let userSignUpHandler: UserSignUpHandler;
  let authRepository: AuthRepository;
  // let passwordService: PasswordService;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserSignUpHandler,
        {
          provide: AuthRepository,
          useValue: {
            getUserByEmail: jest.fn(),
            createUser: { id: '1234', email: 'dev@xanny.us' },
          },
        },
        {
          provide: PasswordService,
          useValue: { hashPassword: jest.fn(() => ({})) },
        },
        { provide: CommandBus, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    userSignUpHandler = moduleRef.get<UserSignUpHandler>(UserSignUpHandler);
    authRepository = moduleRef.get<AuthRepository>(AuthRepository);
    // passwordService = moduleRef.get<PasswordService>(PasswordService);
    commandBus = moduleRef.get<CommandBus>(CommandBus);
  });

  it('should be an instanceof UserSignUpHandler', () => {
    expect(userSignUpHandler).toBeInstanceOf(UserSignUpHandler);
  });

  it('should create a new user and send verification email', async () => {
    const commandData = [
      'xanny',
      'dev@xanny.us',
      'password123',
      'fingerprint',
    ] as const;
    const checkUser = null;
    const save = { id: '123', email: 'dev@xanny.us' };
    const mail = { status: 200 };

    authRepository.getUserByEmail = jest.fn().mockResolvedValue(checkUser);
    authRepository.createUser = jest.fn().mockResolvedValue(save);
    commandBus.execute = jest.fn().mockResolvedValue(mail);

    const result = await userSignUpHandler.execute(
      new UserSignUpCommand(...commandData),
    );

    expect(result).toEqual('plz check your email');
    expect(commandBus.execute).toHaveBeenCalledWith(
      new VerifyEmailCommand(save.id, save.email),
    );
  });

  it('should throw UnauthorizedException when no fingerprint', async () => {
    const commandData = ['xanny', 'dev@xanny.us', 'password123', ''] as const;

    await expect(
      userSignUpHandler.execute(new UserSignUpCommand(...commandData)),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw ConflictException when email is duplicated', async () => {
    const commandData = [
      'xanny',
      'dev@xanny.us',
      'password123',
      'fingerprint',
    ] as const;
    const checkUser = { email: 'dev@xanny.us' };

    authRepository.getUserByEmail = jest.fn().mockResolvedValue(checkUser);

    await expect(
      userSignUpHandler.execute(new UserSignUpCommand(...commandData)),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw UnprocessableEntityException when unable to send email', async () => {
    const commandData = [
      'xanny',
      'dev@xanny.us',
      'password123',
      'fingerprint',
    ] as const;
    const checkUser = null;
    const save = { id: '123', email: 'dev@xanny.us' };
    const mail = { status: 400 };

    authRepository.getUserByEmail = jest.fn().mockResolvedValue(checkUser);
    authRepository.createUser = jest.fn().mockResolvedValue(save);
    commandBus.execute = jest.fn().mockResolvedValue(mail);

    await expect(
      userSignUpHandler.execute(new UserSignUpCommand(...commandData)),
    ).rejects.toThrow(UnprocessableEntityException);
  });
});
