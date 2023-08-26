import { Test } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { AuthController } from './auth.controller';
import { UserSignUpDto } from './dto/signup.dto';
import { UserLoginDto } from './dto/login.dto';
import { UserSignUpCommand } from './commands/signup.command';
import { UserLoginCommand } from './commands/login.command';
import { GetUserFromTokenQuery } from './queries/get-user.query';
import { RefreshTokenCommand } from './commands/refresh-token.command';

describe('AuthController', () => {
  let authController: AuthController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    commandBus = moduleRef.get<CommandBus>(CommandBus);
    queryBus = moduleRef.get<QueryBus>(QueryBus);
  });

  it('should sign up a user', async () => {
    const userSignUpDto: UserSignUpDto = {
      name: 'John Doe',
      handle: '@johndoe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    await authController.signUp(userSignUpDto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      new UserSignUpCommand(
        userSignUpDto.name,
        userSignUpDto.handle,
        userSignUpDto.email.toLowerCase(),
        userSignUpDto.password,
      ),
    );
  });

  it('should login a user', async () => {
    const userLoginDto: UserLoginDto = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    await authController.login(userLoginDto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      new UserLoginCommand(
        userLoginDto.email.toLowerCase(),
        userLoginDto.password,
      ),
    );
  });

  it('should get user from token', async () => {
    const req = { user: 'testUserId' };

    await authController.getUserFromToken(req);

    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetUserFromTokenQuery(req.user),
    );
  });

  it('should refresh token', async () => {
    const req = {
      user: { userId: 'testUserId', refreshToken: 'testRefreshToken' },
    };

    await authController.refreshToken(req);

    expect(commandBus.execute).toHaveBeenCalledWith(
      new RefreshTokenCommand(req.user.userId, req.user.refreshToken),
    );
  });
});
