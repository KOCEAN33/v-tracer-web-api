import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UserRepository } from './repository/user.repository';

import { GetMyProfileHandler } from './queries/get-my-profile.handler';
import { KyselyModule } from '../../database/kysely.module';

const commandHandlers = [];

const queryHandlers = [GetMyProfileHandler];

@Module({
  imports: [CqrsModule, KyselyModule],
  controllers: [UsersController],
  providers: [UserRepository, ...commandHandlers, ...queryHandlers],
})
export class UsersModule {}
