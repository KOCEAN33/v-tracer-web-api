import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../../common/decorators/get-user.decorator';

@Controller('/api/vtubers')
export class StreamsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('/company')
  async addCompany() {}

  @Post('/platform')
  async addPlatform() {}

  @Post('/vtuber')
  async addVtuber() {}
}
