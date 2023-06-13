import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { UserSignUpDto } from './dto/signup.dto';
import { UserLoginDto } from './dto/login.dto';

import { UserSignUpCommand } from './commands/signup.command';
import { UserLoginCommand } from './commands/login.command';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';

import { RefreshTokenCommand } from './commands/refresh-token.command';
import { GetUserFromTokenQuery } from './queries/get-user.query';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth API')
@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Post('/signup')
  @ApiOperation({ summary: 'User Signup' })
  @ApiTags('Auth')
  @ApiCreatedResponse({ description: '유저 생성', type: UserSignUpDto })
  async signUp(@Body() dto: UserSignUpDto) {
    dto.email = dto.email.toLowerCase();
    const { name, handle, email, password } = dto;
    const command = new UserSignUpCommand(name, handle, email, password);
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'User Login' })
  @ApiCreatedResponse({ description: 'User Login', type: UserLoginDto })
  @Post('/login')
  async login(@Body() dto: UserLoginDto) {
    dto.email = dto.email.toLowerCase();
    const { email, password } = dto;
    const command = new UserLoginCommand(email, password);
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'User Login' })
  @ApiCreatedResponse({ description: 'User Login', type: UserLoginDto })
  @ApiBearerAuth()
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
