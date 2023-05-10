import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateUserDto } from './dto/create-user.dto';

import { CreateUserCommand } from './commands/create-user.command';
import { LoginCommand } from './commands/login.command';
import { GetUserInfoQuery } from './queries/get-user-info.query';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('users')
export class UsersController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Post()
  createUser(@Body() dto: CreateUserDto): Promise<string> {
    const { name, email, password } = dto;
    const command = new CreateUserCommand(name, email, password);
    return this.commandBus.execute(command);
  }

  @Post('/login')
  login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    const command = new LoginCommand(email, password);
    return this.commandBus.execute(command);
  }

  @Get('/info')
  myInfo(@Param() userId: string): Promise<void> {
    const getUserInfoQuery = new GetUserInfoQuery(userId);

    return this.queryBus.execute(getUserInfoQuery);
  }
}
