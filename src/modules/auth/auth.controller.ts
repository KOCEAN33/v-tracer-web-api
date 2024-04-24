import type { Response, Request } from 'express';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  Ip,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '../../common/decorators/get-user.decorator';

import { UserSignUpDto } from './dto/signup.dto';
import { UserLoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

import { UserSignUpCommand } from './commands/signup.command';
import { UserLoginCommand } from './commands/login.command';
import { RefreshTokenCommand } from './commands/refresh-token.command';
import { UserVerifyEmailCommand } from './commands/verify-email.command';
import { UserLogoutCommand } from './commands/logout.command';
import { SocialLoginCommand } from './commands/social-login.command';

@ApiTags('Auth API')
@Controller('/api/auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ summary: 'User Login' })
  @ApiCreatedResponse({ description: 'User Login', type: UserLoginDto })
  @Post('/login')
  async login(
    @Ip() ip: string,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() dto: UserLoginDto,
  ) {
    dto.email = dto.email.toLowerCase();
    const userAgent = req.headers['user-agent'] as string;
    const { email, password } = dto;
    const command = new UserLoginCommand(
      email,
      password,
      response,
      ip,
      userAgent,
    );
    return this.commandBus.execute(command);
  }

  @Get('/refresh')
  async refreshToken(
    @Ip() ip: string,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userAgent = req.headers['user-agent'];
    const refreshToken = req.cookies['token'];
    const command = new RefreshTokenCommand(
      refreshToken,
      response,
      ip,
      userAgent,
    );
    return this.commandBus.execute(command);
  }

  @Post('/signup')
  @ApiOperation({ summary: 'User Signup' })
  @ApiTags('Auth')
  @ApiCreatedResponse({ description: '회원 가입', type: UserSignUpDto })
  async signUp(@Body() dto: UserSignUpDto) {
    dto.email = dto.email.toLowerCase();
    const { name, email, password } = dto;
    const command = new UserSignUpCommand(name, email, password);
    return this.commandBus.execute(command);
  }

  @Post('/verify/email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    const { verifyCode } = dto;
    const command = new UserVerifyEmailCommand(verifyCode);
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Logout' })
  @Post('/logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Body() dto: LogoutDto,
    @Ip() ip: string,
  ) {
    const userAgent = req.headers['user-agent'];
    const refreshToken = req.cookies['token'] as string;
    const { userId } = dto;
    const command = new UserLogoutCommand(
      res,
      userId,
      refreshToken,
      ip,
      userAgent,
    );
    return this.commandBus.execute(command);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return HttpStatus.OK;
  }

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Ip() ip: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const userAgent = req.headers['user-agent'] as string;
    const command = new SocialLoginCommand(req, res, ip, userAgent);
    return this.commandBus.execute(command);
  }

  @Get('/github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    return HttpStatus.OK;
  }

  @Get('/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(
    @Res() res: Response,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    const userAgent = req.headers['user-agent'] as string;
    const command = new SocialLoginCommand(req, res, ip, userAgent);
    return this.commandBus.execute(command);
  }
}
