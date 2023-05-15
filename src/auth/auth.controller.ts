import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/login.dto';
import { UserSignUpCommand } from './commands/create-user.command';
import { UserLoginCommand } from './commands/login.command';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';
import { RefreshTokenCommand } from './commands/refresh-token.command';
import { GetUserFromTokenQuery } from './queries/get-user.query';

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

  @UseGuards(JwtAuthGuard)
  @Get('/get')
  async getUserFromToken(@Req() req) {
    const userId = req.user.userId;
    const getUserFromToken = new GetUserFromTokenQuery(userId);
    return this.queryBus.execute(getUserFromToken);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshToken(@Req() req) {
    const userId = req.user['userId'];
    const refreshToken = req.user['refreshToken'];
    const command = new RefreshTokenCommand(userId, refreshToken);
    return this.commandBus.execute(command);
  }
}
