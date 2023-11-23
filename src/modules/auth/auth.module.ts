import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';

import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtGuard } from './guards/jwt.guard';
import { GithubStrategy } from './strategies/github.strategy';
import { GithubGuard } from './guards/github.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleGuard } from './guards/google.guard';

import { AuthRepository } from './repository/auth.repository';

import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { EmailModule } from '../email/email.module';

import { SecurityConfig } from '../../common/config/config.interface';

import { UserSignUpHandler } from './commands/signup.handler';
import { UserLoginHandler } from './commands/login.handler';
import { RefreshTokenHandler } from './commands/refresh-token.handler';
import { UserVerifyEmailHandler } from './commands/verify-email.handler';
import { UserLogoutHandler } from './commands/logout.handler';
import { SaveTokenEventHandler } from './events/save-token.event.handler';
import { UpdateTokenEventHandler } from './events/update-token.event.handler';
import { SendVerifyEmailEventHandler } from './events/send-verify-email.event.handler';
import { SocialAuthService } from './social-auth.service';
import { SocialLoginHandler } from './commands/social-login.handler';

const commandHandlers = [
  UserSignUpHandler,
  UserLoginHandler,
  RefreshTokenHandler,
  UserVerifyEmailHandler,
  UserLogoutHandler,
  SocialLoginHandler,
];

const queryHandlers = [];

const eventHandlers = [
  SaveTokenEventHandler,
  UpdateTokenEventHandler,
  SendVerifyEmailEventHandler,
];

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: securityConfig.expiresIn,
            algorithm: 'HS384',
          },
          verifyOptions: {
            algorithms: ['HS384'],
          },
        };
      },
      inject: [ConfigService],
    }),
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthRepository,
    TokenService,
    PasswordService,
    JwtStrategy,
    JwtGuard,
    GoogleGuard,
    GoogleStrategy,
    EmailModule,
    SocialAuthService,
    GithubStrategy,
    GithubGuard,

    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
  ],
  exports: [JwtGuard],
})
export class AuthModule {}
