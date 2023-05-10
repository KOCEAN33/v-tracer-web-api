import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { CqrsModule } from '@nestjs/cqrs';

import { CreateUserHandler } from './commands/create-user.handler';
import { LoginHandler } from './commands/login.handler';
import { GetUserInfoQueryHandler } from './queries/get-user-info.handler';
import { PrismaService } from '../prisma.service';
import { UserRepository } from './repository/user.repository';
import { AuthModule } from '../auth/auth.module';

const commandHandlers = [CreateUserHandler, LoginHandler];

const queryHandlers = [GetUserInfoQueryHandler];

@Module({
  imports: [CqrsModule, AuthModule],
  controllers: [UsersController],
  providers: [
    PrismaService,
    UserRepository,

    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class UsersModule {}
