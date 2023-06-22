import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { CreateReviewCommand } from './commands/create-review.command';
import { PatchReviewCommand } from './commands/patch-review.command';
import { DeleteReviewCommand } from './commands/delete-review.command';
import { PublicGetReviewsQuery } from './queries/get-reviews-product-handle.query';

import { CreateReviewDto } from './dto/create-review.dto';
import { PatchReviewDto } from './dto/patch-review.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';
import { QueryParamsDto } from './dto/query-params.dto';

@Controller('review')
export class ReviewController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private readonly logger: Logger,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/product')
  async createReview(@Req() req, @Body() dto: CreateReviewDto) {
    const authorId = req.user.userId;
    const { productId, title, body, publish } = dto;
    const command = new CreateReviewCommand(
      authorId,
      productId,
      title,
      body,
      publish,
    );
    return this.commandBus.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/product')
  async patchReview(@Req() req, @Body() dto: PatchReviewDto) {
    const authorId = req.user.userId;
    const { reviewId, title, body, publish } = dto;
    const command = new PatchReviewCommand(
      authorId,
      reviewId,
      title,
      body,
      publish,
    );
    return await this.commandBus.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/product')
  async deleteReview(@Req() req, @Body() dto: DeleteReviewDto) {
    const authorId = req.user.userId;
    const { reviewId } = dto;
    const command = new DeleteReviewCommand(authorId, reviewId);
    return await this.commandBus.execute(command);
  }

  // Query
  @Get('/search')
  async getReviewsByProductHandle(@Query() params: QueryParamsDto) {
    const { handle, productId } = params;
    const query = new PublicGetReviewsQuery(handle, productId);
    return this.queryBus.execute(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async getReviewsByUser(@Query() params: QueryParamsDto) {
    const { handle } = params;
    const query = new PublicGetReviewsQuery(handle, null);
    return this.queryBus.execute(query);
  }
}
