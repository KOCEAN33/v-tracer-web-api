import { Test } from '@nestjs/testing';
import { UnprocessableEntityException } from '@nestjs/common';

import { UserSignUpCommand } from './signup.command';
import { UserSignUpHandler } from './signup.handler';
import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from '../password.service';
import { TokenService } from '../token.service';
import { EventBus } from '@nestjs/cqrs';
import { CreateNewTokenEvent } from '../events/create-token.event';

describe('UserSignUpHandler', () => {
  let userSignUpHandler: UserSignUpHandler;
  let authRepository: AuthRepository;
  let passwordService: PasswordService;
  let tokenService: TokenService;
  let eventBus: EventBus;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserSignUpHandler,
        {
          provide: AuthRepository,
          useValue: {},
        },
        { provide: PasswordService, useValue: {} },
        { provide: TokenService, useValue: {} },
        { provide: EventBus, useValue: {} },
      ],
    }).compile();

    userSignUpHandler = moduleRef.get<UserSignUpHandler>(UserSignUpHandler);
    authRepository = moduleRef.get<AuthRepository>(AuthRepository);
    passwordService = moduleRef.get<PasswordService>(PasswordService);
    tokenService = moduleRef.get<TokenService>(TokenService);
    eventBus = moduleRef.get<EventBus>(EventBus);
  });

  it('should create a new user and return tokens', async () => {
    const command = new UserSignUpCommand(
      'John Doe',
      '@johndoe',
      'john.doe@example.com',
      'password123',
    );
    const hashedPassword = 'hashed_password';
    const user = {
      id: '1',
      name: 'John Doe',
      handle: '@johndoe',
      email: 'john.doe@example.com',
      password: hashedPassword,
    };
    const tokens = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    passwordService.hashPassword = jest.fn().mockResolvedValue(hashedPassword);
    authRepository.getUserByEmail = jest.fn().mockResolvedValue(null);
    authRepository.getUserByHandle = jest.fn().mockResolvedValue(null);
    authRepository.createUser = jest.fn().mockResolvedValue(user);
    tokenService.generateTokens = jest.fn().mockReturnValue(tokens);
    eventBus.publish = jest.fn();

    const result = await userSignUpHandler.execute(command);

    expect(result).toEqual(tokens);
    expect(passwordService.hashPassword).toHaveBeenCalledWith(command.password);
    expect(authRepository.getUserByEmail).toHaveBeenCalledWith(command.email);
    expect(authRepository.createUser).toHaveBeenCalledWith(
      command.name,
      command.handle,
      command.email,
      hashedPassword,
    );
    expect(tokenService.generateTokens).toHaveBeenCalledWith({
      userId: user.id,
    });

    expect(eventBus.publish).toHaveBeenCalledWith(
      new CreateNewTokenEvent(user.id, tokens.accessToken, tokens.refreshToken),
    );
  });

  it('should throw UnprocessableEntityException if email is already used', async () => {
    const command = new UserSignUpCommand(
      'John Doe',
      '@johndoe',
      'john.doe@example.com',
      'password123',
    );
    const hashedPassword = 'hashed_password';
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
    };

    passwordService.hashPassword = jest.fn().mockResolvedValue(hashedPassword);
    authRepository.getUserByEmail = jest.fn().mockResolvedValue(user);
    authRepository.getUserByHandle = jest.fn().mockResolvedValue(null);

    await expect(userSignUpHandler.execute(command)).rejects.toThrow(
      new UnprocessableEntityException(`Email ${command.email} already used.`),
    );
    expect(authRepository.getUserByEmail).toHaveBeenCalledWith(command.email);
    expect(authRepository.getUserByHandle).toHaveBeenCalledWith(command.handle);
  });

  it('should throw UnprocessableEntityException if handle is already used', async () => {
    const command = new UserSignUpCommand(
      'John Doe',
      '@johndoe',
      'john.doe@example.com',
      'password123',
    );
    const hashedPassword = 'hashed_password';
    const user = {
      id: '1',
      name: 'John Doe',
      handle: '@johndoe',
      email: 'john.doe@example.com',
      password: hashedPassword,
    };

    passwordService.hashPassword = jest.fn().mockResolvedValue(hashedPassword);
    authRepository.getUserByEmail = jest.fn().mockResolvedValue(null);
    authRepository.getUserByHandle = jest.fn().mockResolvedValue(user);

    await expect(userSignUpHandler.execute(command)).rejects.toThrow(
      new UnprocessableEntityException(
        `Handle ${command.handle} already used.`,
      ),
    );
    expect(authRepository.getUserByEmail).toHaveBeenCalledWith(command.email);
    expect(authRepository.getUserByHandle).toHaveBeenCalledWith(command.handle);
  });

  it('should throw UnprocessableEntityException if handle and email is already used', async () => {
    const command = new UserSignUpCommand(
      'John Doe',
      '@johndoe',
      'john.doe@example.com',
      'password123',
    );
    const hashedPassword = 'hashed_password';
    const user = {
      id: '1',
      name: 'John Doe',
      handle: '@johndoe',
      email: 'john.doe@example.com',
      password: hashedPassword,
    };

    passwordService.hashPassword = jest.fn().mockResolvedValue(hashedPassword);
    authRepository.getUserByEmail = jest.fn().mockResolvedValue(user);
    authRepository.getUserByHandle = jest.fn().mockResolvedValue(user);

    await expect(userSignUpHandler.execute(command)).rejects.toThrow(
      new UnprocessableEntityException(
        `Email ${command.email} and Handle ${command.handle} already used.`,
      ),
    );
    expect(authRepository.getUserByEmail).toHaveBeenCalledWith(command.email);
    expect(authRepository.getUserByHandle).toHaveBeenCalledWith(command.handle);
  });
});
