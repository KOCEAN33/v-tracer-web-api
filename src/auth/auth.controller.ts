import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/login.dto';
import { UserSignUpCommand } from './commands/create-user.command';
import { UserLoginCommand } from './commands/login.command';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Post('/signup')
  async signUp(@Body() dto: CreateUserDto) {
    dto.email = dto.email.toLowerCase();
    const { name, email, password } = dto;
    const command = new UserSignUpCommand(name, email, password);
    return this.commandBus.execute(command);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto) {
    dto.email = dto.email.toLowerCase();
    const { email, password } = dto;
    const command = new UserLoginCommand(email, password);
    return this.commandBus.execute(command);
  }

  async refreshToken() {}

  async getUserFromToken() {}
}
