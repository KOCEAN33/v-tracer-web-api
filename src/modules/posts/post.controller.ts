import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { CreatePostCommand } from './commands/create-post.command';
import { User } from '../../common/decorators/get-user.decorator';
import { GetReviewsQuery } from './queries/get-reviews.query';
import { GetReviewsDto } from './dto/get-reviews.dto';

@Controller('/api/posts')
export class PostController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@User() userId: number, @Body() dto: CreatePostDto) {
    const { title, body, type, status, productHandle } = dto;
    const command = new CreatePostCommand(
      title,
      body,
      type,
      status,
      productHandle,
      userId,
    );
    return this.commandBus.execute(command);
  }

  @Get('/reviews')
  async getReviews(@Body() dto: GetReviewsDto) {
    const { productHandle } = dto;
    const query = new GetReviewsQuery(productHandle);
    return this.queryBus.execute(query);
  }
}
