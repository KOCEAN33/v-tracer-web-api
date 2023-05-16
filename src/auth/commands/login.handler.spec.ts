import { Test } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';

import { UserLoginCommand } from './login.command';
import { UserLoginHandler } from './login.handler';
import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from '../password.service';
import { TokenService } from '../token.service';
import { SaveTokenEvent } from '../events/save-token.event';

describe('UserLoginHandler', () => {
  let userLoginHandler: UserLoginHandler;
  let authRepository: AuthRepository;
  let passwordService: PasswordService;
  let tokenService: TokenService;
  let eventBus: EventBus;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserLoginHandler,
        { provide: AuthRepository, useValue: {} },
        { provide: PasswordService, useValue: {} },
        { provide: TokenService, useValue: {} },
        { provide: EventBus, useValue: {} },
      ],
    }).compile();

    userLoginHandler = moduleRef.get<UserLoginHandler>(UserLoginHandler);
    authRepository = moduleRef.get<AuthRepository>(AuthRepository);
    passwordService = moduleRef.get<PasswordService>(PasswordService);
    tokenService = moduleRef.get<TokenService>(TokenService);
    eventBus = moduleRef.get<EventBus>(EventBus);
  });

  it('should log in user, generate tokens, and publish SaveTokenEvent', async () => {
    const command = new UserLoginCommand('test@email.com', 'password');
    const user = { id: '1', email: command.email, password: 'hashed_password' };
    const tokens = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    authRepository.getUserByEmail = jest.fn().mockResolvedValue(user);
    passwordService.validatePassword = jest.fn().mockResolvedValue(true);
    tokenService.generateTokens = jest.fn().mockResolvedValue(tokens);
    eventBus.publish = jest.fn();

    const result = await userLoginHandler.execute(command);

    expect(result).toEqual(tokens);
    expect(authRepository.getUserByEmail).toHaveBeenCalledWith(command.email);
    expect(passwordService.validatePassword).toHaveBeenCalledWith(
      command.password,
      user.password,
    );
    expect(tokenService.generateTokens).toHaveBeenCalledWith({
      userId: user.id,
    });
    expect(eventBus.publish).toHaveBeenCalledWith(
      new SaveTokenEvent(user.id, tokens.accessToken, tokens.refreshToken),
    );
  });

  it('should throw BadRequestException if user does not exist', async () => {
    const command = new UserLoginCommand('test@email.com', 'password');

    authRepository.getUserByEmail = jest.fn().mockResolvedValue(null);

    await expect(userLoginHandler.execute(command)).rejects.toThrow(
      BadRequestException,
    );
    expect(authRepository.getUserByEmail).toHaveBeenCalledWith(command.email);
  });

  it('should throw BadRequestException if password is invalid', async () => {
    const command = new UserLoginCommand('test@email.com', 'password');
    const user = { id: '1', email: command.email, password: 'hashed_password' };

    authRepository.getUserByEmail = jest.fn().mockResolvedValue(user);
    passwordService.validatePassword = jest.fn().mockResolvedValue(false);

    await expect(userLoginHandler.execute(command)).rejects.toThrow(
      BadRequestException,
    );
    expect(authRepository.getUserByEmail).toHaveBeenCalledWith(command.email);
    expect(passwordService.validatePassword).toHaveBeenCalledWith(
      command.password,
      user.password,
    );
  });
});
