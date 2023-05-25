import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { SecurityConfig } from '../common/config/config.interface';
import { AuthController } from './auth.controller';

import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

import { AuthRepository } from './repository/auth.repository';

import { PasswordService } from './password.service';
import { TokenService } from './token.service';

import { UserSignUpHandler } from './commands/handler/signup.handler';
import { UserLoginHandler } from './commands/handler/login.handler';
import { RefreshTokenHandler } from './commands/handler/refresh-token.handler';
import { GetUserFromTokenHandler } from './queries/handler/get-user.handler';
import { UpdateTokenHandler } from './events/handler/update-token.handler';
import { CreateNewTokenHandler } from './events/handler/create-token.handler';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';

const commandHandlers = [
  UserSignUpHandler,
  UserLoginHandler,
  RefreshTokenHandler,
];

const queryHandlers = [GetUserFromTokenHandler];

const eventHandlers = [UpdateTokenHandler, CreateNewTokenHandler];

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
    JwtRefreshStrategy,
    JwtRefreshGuard,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
