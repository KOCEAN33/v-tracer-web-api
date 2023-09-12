import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  Ip,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { Request, Response } from 'express';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserSignUpDto } from './dto/signup.dto';
import { UserLoginDto } from './dto/login.dto';

import { UserSignUpCommand } from './commands/signup.command';
import { UserLoginCommand } from './commands/login.command';

import { RefreshTokenCommand } from './commands/refresh-token.command';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CustomRequest } from '../../common/interface/custom-request.interface';
import { VerifyEmailQueryDTO } from './dto/verify-email.query.dto';
import { UserVerifyEmailCommand } from './commands/verify-email.command';

@ApiTags('Auth API')
@Controller('/api/auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @ApiOperation({ summary: 'User Login' })
  @ApiCreatedResponse({ description: 'User Login', type: UserLoginDto })
  @Post('/login')
  async login(
    @Ip() ip: string,
    @Req() req: CustomRequest,
    @Res({ passthrough: true }) response: Response,
    @Body() dto: UserLoginDto,
  ) {
    dto.email = dto.email.toLowerCase();
    const fingerprint = req.headers['fingerprint'] as string;
    const userAgent = req.headers['user-agent'];
    const { email, password } = dto;
    const command = new UserLoginCommand(
      email,
      password,
      response,
      ip,
      userAgent,
      fingerprint,
    );
    return this.commandBus.execute(command);
  }

  @Get('/refresh')
  async refreshToken(
    @Ip() ip: string,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const fingerprint = req.headers['fingerprint'] as string;
    const userAgent = req.headers['user-agent'];
    const refreshToken = req.cookies['token'];
    const command = new RefreshTokenCommand(
      refreshToken,
      response,
      ip,
      userAgent,
      fingerprint,
    );
    return this.commandBus.execute(command);
  }

  @Post('/signup')
  @ApiOperation({ summary: 'User Signup' })
  @ApiTags('Auth')
  @ApiCreatedResponse({ description: '회원 가입', type: UserSignUpDto })
  async signUp(@Req() req: Request, @Body() dto: UserSignUpDto) {
    dto.email = dto.email.toLowerCase();
    const fingerprint = req.headers['fingerprint'] as string;
    const { name, email, password } = dto;
    const command = new UserSignUpCommand(name, email, password, fingerprint);
    return this.commandBus.execute(command);
  }

  @Post('/verify/email')
  async verifyEmail(@Query() queryString: VerifyEmailQueryDTO) {
    const { id, confirmationCode } = queryString;
    const command = new UserVerifyEmailCommand(id, confirmationCode);
    return this.commandBus.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/test')
  async ping(@Req() req, @Ip() ip) {
    return ip;
  }

  @ApiOperation({ summary: 'Logout' })
  @Post('/logout')
  async logout() {
    return;
  }

  @ApiOperation({ summary: 'Logout from every device' })
  @Post('/logout-all')
  async purgeToken() {
    return;
  }
}
