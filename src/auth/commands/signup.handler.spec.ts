import { Test } from '@nestjs/testing';
import { UnprocessableEntityException } from '@nestjs/common';

import { UserSignUpCommand } from './signup.command';
import { UserSignUpHandler } from './signup.handler';
import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from '../password.service';
import { TokenService } from '../token.service';

describe('UserSignUpHandler', () => {
  let userSignUpHandler: UserSignUpHandler;
  let repository: AuthRepository;
  let passwordService: PasswordService;
  let tokenService: TokenService;

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
      ],
    }).compile();

    userSignUpHandler = moduleRef.get<UserSignUpHandler>(UserSignUpHandler);
    repository = moduleRef.get<AuthRepository>(AuthRepository);
    passwordService = moduleRef.get<PasswordService>(PasswordService);
    tokenService = moduleRef.get<TokenService>(TokenService);
  });

  it('should create a new user and return tokens', async () => {
    const command = new UserSignUpCommand(
      'John Doe',
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
    const tokens = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    passwordService.hashPassword = jest.fn().mockResolvedValue(hashedPassword);
    repository.getUserByEmail = jest.fn().mockResolvedValue(null);
    repository.createUser = jest.fn().mockResolvedValue(user);
    tokenService.generateTokens = jest.fn().mockReturnValue(tokens);

    const result = await userSignUpHandler.execute(command);

    expect(result).toEqual(tokens);
    expect(passwordService.hashPassword).toHaveBeenCalledWith('password123');
    expect(repository.getUserByEmail).toHaveBeenCalledWith(
      'john.doe@example.com',
    );
    expect(repository.createUser).toHaveBeenCalledWith(
      'John Doe',
      'john.doe@example.com',
      hashedPassword,
    );
    expect(tokenService.generateTokens).toHaveBeenCalledWith({
      userId: user.id,
    });
  });

  it('should throw UnprocessableEntityException if email is already used', async () => {
    const command = new UserSignUpCommand(
      'John Doe',
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
    repository.getUserByEmail = jest.fn().mockResolvedValue(user);

    await expect(userSignUpHandler.execute(command)).rejects.toThrow(
      new UnprocessableEntityException(
        `Email john.doe@example.com already used.`,
      ),
    );
    expect(passwordService.hashPassword).toHaveBeenCalledWith('password123');
    expect(repository.getUserByEmail).toHaveBeenCalledWith(
      'john.doe@example.com',
    );
  });
});
