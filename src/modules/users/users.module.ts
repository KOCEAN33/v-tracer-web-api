import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UserRepository } from './repository/user.repository';
import { PrismaModule } from '../../database/prisma.module';
import { GetMyProfileHandler } from './queries/get-my-profile.handler';

const commandHandlers = [];

const queryHandlers = [GetMyProfileHandler];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [UsersController],
  providers: [UserRepository, ...commandHandlers, ...queryHandlers],
})
export class UsersModule {}
