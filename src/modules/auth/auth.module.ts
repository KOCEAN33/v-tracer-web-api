import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';

import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

import { AuthRepository } from './repository/auth.repository';

import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { EmailModule } from '../email/email.module';
import { UserAgentParser } from './ua.service';

import { SecurityConfig } from '../../common/config/config.interface';

import { UserSignUpHandler } from './commands/signup.handler';
import { UserLoginHandler } from './commands/login.handler';
import { RefreshTokenHandler } from './commands/refresh-token.handler';
import { UserVerifyEmailHandler } from './commands/verify-email.handler';
import { UserLogoutHandler } from './commands/logout.handler';
import { SaveTokenEventHandler } from './events/save-token.event.handler';
import { UpdateTokenEventHandler } from './events/update-token.event.handler';
import { SendVerifyEmailEventHandler } from './events/send-verify-email.event.handler';

const commandHandlers = [
  UserSignUpHandler,
  UserLoginHandler,
  RefreshTokenHandler,
  UserVerifyEmailHandler,
  UserLogoutHandler,
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
    JwtAuthGuard,
    EmailModule,
    UserAgentParser,

    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
