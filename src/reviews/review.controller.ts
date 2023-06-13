import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';

import { CreateReviewByProductHandleCommand } from './commands/create-review.command';
import { GetReviewsByProductHandleQuery } from './queries/get-reviews-product-handle.query';

@Controller('review')
export class ReviewController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @UseGuards(JwtAuthGuard)
  @Post('create/:PRODUCTHANDLE')
  async createReviewByProductHandle(
    @Req() req,
    @Param('PRODUCTHANDLE') PRODUCTHANDLE: string,
    @Body() dto: CreateReviewDto,
  ) {
    const authorId = req.user;
    const { title, body, published } = dto;
    const command = new CreateReviewByProductHandleCommand(
      authorId,
      PRODUCTHANDLE,
      title,
      body,
      published,
    );
    return this.commandBus.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('edit/:REVIEWID')
  async patchReview(@Req() req, @Param('REVIEWID') REVIEWID) {
    return REVIEWID;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:reviewId')
  async deleteReview(@Req() req, @Param('REVIEWID') REVIEWID) {
    return;
  }

  // Query Controllers
  @Get('/product/:PRODUCTHANDLE')
  async getReviewsByProductHandle(
    @Param('PRODUCTHANDLE') PRODUCTHANDLE: string,
  ) {
    const query = new GetReviewsByProductHandleQuery(PRODUCTHANDLE);
    return this.queryBus.execute(query);
  }
}
