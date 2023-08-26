import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { UserSignUpDto } from './dto/signup.dto';
import { UserLoginDto } from './dto/login.dto';

import { UserSignUpCommand } from './commands/signup.command';
import { UserLoginCommand } from './commands/login.command';

import { RefreshTokenCommand } from './commands/refresh-token.command';
import { GetUserFromTokenQuery } from './queries/get-user.query';

import { Request, Response } from 'express';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Auth API')
@Controller('/api/auth')
export class AuthController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @ApiOperation({ summary: 'User Login' })
  @ApiCreatedResponse({ description: 'User Login', type: UserLoginDto })
  @Post('/login')
  async login(
    @Body() dto: UserLoginDto,
    @Res({ passthrough: true }) response: any,
  ) {
    dto.email = dto.email.toLowerCase();
    const { email, password } = dto;
    const command = new UserLoginCommand(email, password, response);
    return this.commandBus.execute(command);
  }

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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/get')
  async getUserFromToken(@Req() req) {
    const userId = req.user;
    const getUserFromToken = new GetUserFromTokenQuery(userId);
    return this.queryBus.execute(getUserFromToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async ping() {
    return 'pong';
  }

  @Get('/refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = req.cookies['token'];
    const command = new RefreshTokenCommand(refreshToken, response);
    return this.commandBus.execute(command);
  }
}
