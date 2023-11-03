import { Controller, Get, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../common/decorators/get-user.decorator';
import { GetMyProfileQuery } from './queries/get-my-profile.query';

@Controller('/api/users')
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/getme')
  async getMyInfo(@User() userId: number) {
    const query = new GetMyProfileQuery(userId);
    return this.queryBus.execute(query);
  }
}
