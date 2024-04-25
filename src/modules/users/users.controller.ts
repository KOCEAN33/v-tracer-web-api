import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetMyProfileQuery } from './queries/get-my-profile.query';
import { User } from '../../common/decorators/get-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GetmeResDto } from './dto/getme.res.dto';

@ApiTags('Users')
@Controller('/api/users')
export class UsersController {
  constructor(private queryBus: QueryBus) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user profile info',
  })
  @ApiResponse({
    status: 200,
    type: GetmeResDto,
    description: 'User Profile Info',
  })
  @UseGuards(JwtGuard)
  @Get('/getme')
  async getMyInfo(@User() userId: number): Promise<GetmeResDto> {
    const query = new GetMyProfileQuery(userId);
    return this.queryBus.execute(query);
  }
}
