import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { CreateReviewCommand } from './commands/createReview.command';
import { PatchReviewCommand } from './commands/patchReview.command';
import { DeleteReviewCommand } from './commands/deleteReview.command';
import { FindReviewByProductQuery } from './queries/findReviewByProduct.query';
import { FindReviewsByUserQuery } from './queries/findReviewsByUserId.query';

import { CreateReviewBodyDTO } from './dto/createReview.body.dto';
import { PatchReviewBodyDTO } from './dto/patchReview.body.dto';
import { DeleteReviewQueryStringDTO } from './dto/deleteReview.query.dto';
import { FindReviewByProductQueryStringDTO } from './dto/findReviewByProduct.query.dto';
import { FindReviewsByUserQueryStringDTO } from './dto/findReviewsByUser.query.dto';
import { Review } from '@prisma/client';

@Controller('review')
export class ReviewController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @UseGuards(JwtAuthGuard)
  @Post('/product')
  async createReview(
    @Req() req,
    @Body() dto: CreateReviewBodyDTO,
  ): Promise<void> {
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
  async patchReview(
    @Req() req,
    @Body() dto: PatchReviewBodyDTO,
  ): Promise<void> {
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
  async deleteReview(
    @Req() req,
    @Query() queryString: DeleteReviewQueryStringDTO,
  ): Promise<void> {
    const userId = req.user.userId;
    const { reviewId } = queryString;
    const command = new DeleteReviewCommand(userId, reviewId);
    return await this.commandBus.execute(command);
  }

  // Query
  @Get()
  async findReviewByProduct(
    @Query() queryString: FindReviewByProductQueryStringDTO,
  ): Promise<Review[]> {
    const { product, productId } = queryString;
    const query = new FindReviewByProductQuery(product, productId);
    return await this.queryBus.execute(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async findReviewsByUser(
    @Req() req,
    @Query() queryString: FindReviewsByUserQueryStringDTO,
  ): Promise<Review[]> {
    const userId = req.user.userId;
    const { productId } = queryString;
    const query = new FindReviewsByUserQuery(userId, productId);
    return this.queryBus.execute(query);
  }
}
