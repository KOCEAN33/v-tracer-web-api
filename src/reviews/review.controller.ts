import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';

import { CreateReviewCommand } from './commands/create-review.command';
import { GetReviewsByProductHandleQuery } from './queries/get-reviews-product-handle.query';
import { PatchReviewCommand } from './commands/patch-review.command';
import { PatchReviewBodyDto } from './dto/patch-review-body.dto';

@Controller('review')
export class ReviewController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @UseGuards(JwtAuthGuard)
  @Post('product')
  async createReview(@Req() req, @Body() dto: CreateReviewDto) {
    const authorId = req.user;
    const { productId, title, body, published } = dto;
    const command = new CreateReviewCommand(
      authorId,
      productId,
      title,
      body,
      published,
    );
    return this.commandBus.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('product')
  async patchReview(@Req() req, @Body() dto: PatchReviewBodyDto) {
    const authorId = req.user;
    const { reviewId, title, body, published } = dto;
    const command = new PatchReviewCommand(
      authorId,
      reviewId,
      title,
      body,
      published,
    );
    return await this.commandBus.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('product')
  async deleteReview(@Req() req, @Param('REVIEWID') REVIEWID) {
    return;
  }

  // Query Controllers
  @Get('product')
  async getReviewsByProductHandle(
    @Param('PRODUCTHANDLE') PRODUCTHANDLE: string,
    @Query() Params,
  ) {
    console.log(Params);
    const query = new GetReviewsByProductHandleQuery(PRODUCTHANDLE);
    return this.queryBus.execute(query);
  }
}
