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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UserSignUpDto } from './dto/signup.dto';
import { UserLoginDto } from './dto/login.dto';

import { UserSignUpCommand } from './commands/signup.command';
import { UserLoginCommand } from './commands/login.command';

import { RefreshTokenCommand } from './commands/refresh-token.command';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CustomRequest } from '../../common/interface/custom-request.interface';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserVerifyEmailCommand } from './commands/verify-email.command';
import { UserLogoutCommand } from './commands/logout.command';
import { LogoutDto } from './dto/logout.dto';
import { GetMyInfoQuery } from './queries/get-myinfo.query';
import { User } from '../../common/decorators/get-user.decorator';
import { UserEntity } from './entity/user-id.entity';

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
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    const { verifyCode } = dto;
    const command = new UserVerifyEmailCommand(verifyCode);
    return this.commandBus.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Get('myinfo')
  async getMyInfo(@User() userId: string) {
    const query = new GetMyInfoQuery(userId);
    return this.queryBus.execute(query);
  }

  @ApiOperation({ summary: 'Logout' })
  @Post('/logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Body() dto: LogoutDto,
    @Ip() ip: string,
  ) {
    const fingerprint = req.headers['fingerprint'] as string;
    const userAgent = req.headers['user-agent'];
    const refreshToken = req.cookies['token'];
    const { userId } = dto;
    const command = new UserLogoutCommand(
      res,
      userId,
      refreshToken,
      ip,
      userAgent,
      fingerprint,
    );
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Logout from every device' })
  @Post('/logout-all')
  async purgeToken() {
    return;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/test')
  ping(@User() user: UserEntity) {
    return user;
  }
}
