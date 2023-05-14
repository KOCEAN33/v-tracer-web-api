import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UserRepository } from './repository/user.repository';

const commandHandlers = [];

const queryHandlers = [];

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [UserRepository, ...commandHandlers, ...queryHandlers],
})
export class UsersModule {}
