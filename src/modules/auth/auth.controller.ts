import type { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CommandBus } from '@nestjs/cqrs';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Ip,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';

import { SignUpReqDTO } from './dto/signup.req.dto';
import { UserLoginReqDTO } from './dto/login.req.dto';
import { UserLoginResDTO } from './dto/login.res.dto';
import { LogoutReqDTO } from './dto/logout.req.dto';
import { VerifyEmailReqDTO } from './dto/verify-email.req.dto';
import { RefreshTokenResDTO } from './dto/refresh-token.res.dto';

import { UserSignUpCommand } from './commands/signup.command';
import { UserLoginCommand } from './commands/login.command';
import { RefreshTokenCommand } from './commands/refresh-token.command';
import { UserVerifyEmailCommand } from './commands/verify-email.command';
import { UserLogoutCommand } from './commands/logout.command';
import { SocialLoginCommand } from './commands/social-login.command';

@ApiTags('Auth v1')
@Controller('/api/v1/auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ summary: 'User Login' })
  @ApiBody({ description: 'User info', type: UserLoginReqDTO })
  @ApiCreatedResponse({ description: 'User Login', type: UserLoginResDTO })
  @ApiBadRequestResponse({ description: 'Invalid Username or Password' })
  @ApiForbiddenResponse({ description: 'Not verified user' })
  @Post('/login')
  async login(
    @Ip() ip: string,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() dto: UserLoginReqDTO,
  ): Promise<UserLoginResDTO> {
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

  @ApiOperation({ summary: 'Get new access-token, using refresh-token' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: RefreshTokenResDTO,
  })
  @ApiUnauthorizedResponse({ description: 'invalid refresh-token' })
  @ApiForbiddenResponse({
    description: 'Not allow to refresh by token some reason',
  })
  @Get('/refresh')
  async refreshToken(
    @Ip() ip: string,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenResDTO> {
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
  @ApiCreatedResponse({
    description: 'Need to verify email',
    type: 'message',
  })
  @ApiConflictResponse({
    description: 'email is already used',
    type: 'message',
  })
  async signUp(@Body() dto: SignUpReqDTO): Promise<{ message: string }> {
    dto.email = dto.email.toLowerCase();
    const { name, email, password } = dto;
    const command = new UserSignUpCommand(name, email, password);
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Email verify' })
  @ApiBody({ description: 'Send verify code', type: VerifyEmailReqDTO })
  @ApiCreatedResponse({ description: 'Success', type: 'message' })
  @ApiForbiddenResponse({ description: 'verify code is invalid' })
  @Post('/verify/email')
  async verifyEmail(
    @Body() dto: VerifyEmailReqDTO,
  ): Promise<{ message: string }> {
    const { verifyCode } = dto;
    const command = new UserVerifyEmailCommand(verifyCode);
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiBody({ description: 'logout user id', type: LogoutReqDTO })
  @ApiResponse({ status: 201, description: 'Success' })
  @Post('/logout')
  async logout(
    @Ip() ip: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LogoutReqDTO,
  ): Promise<{ message: string }> {
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

  @ApiOperation({ summary: 'Google Login URL' })
  @ApiResponse({ status: 200, description: 'Google Login URL' })
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(): Promise<HttpStatus> {
    return HttpStatus.OK;
  }

  @ApiOperation({ summary: 'Google OAuth' })
  @ApiResponse({ status: 200, description: 'access token' })
  @ApiForbiddenResponse({ description: 'Not authorized from provider' })
  @ApiConflictResponse({ description: 'already exist e-mail' })
  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Ip() ip: string,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<HttpStatus> {
    const userAgent = req.headers['user-agent'] as string;
    const command = new SocialLoginCommand(req, res, ip, userAgent);
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Github OAuth login URL' })
  @ApiResponse({ status: 200, description: 'Github OAuth login URL' })
  @Get('/github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(): Promise<HttpStatus> {
    return HttpStatus.OK;
  }

  @ApiOperation({ summary: 'Github callback' })
  @ApiResponse({ status: 200, description: 'access token' })
  @ApiForbiddenResponse({ description: 'Not authorized from provider' })
  @ApiConflictResponse({ description: 'already exist e-mail' })
  @Get('/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(
    @Ip() ip: string,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<HttpStatus> {
    const userAgent = req.headers['user-agent'] as string;
    const command = new SocialLoginCommand(req, res, ip, userAgent);
    return this.commandBus.execute(command);
  }
}
