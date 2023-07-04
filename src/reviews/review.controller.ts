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
import { Review } from '@prisma/client';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { CreateReviewCommand } from './commands/create-review.command';
import { PatchReviewCommand } from './commands/patch-review.command';
import { DeleteReviewCommand } from './commands/delete-review.command';
import { ByProductQuery } from './queries/by-product.query';
import { FindReviewsByUserQuery } from './queries/by-user.query';

import { CreateReviewBodyDto } from './dto/create-review.body.dto';
import { PatchReviewBodyDto } from './dto/patch-review.body.dto';
import { DeleteReviewQueryStringDTO } from './dto/delete-review.query.dto';
import { FindReviewByProductQueryStringDTO } from './dto/find-product.query.dto';
import { FindReviewsByUserQueryStringDTO } from './dto/find-user.query.dto';

@Controller()
export class ReviewController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @UseGuards(JwtAuthGuard)
  @Post('/review/product')
  async createReview(
    @Req() req,
    @Body() dto: CreateReviewBodyDto,
  ): Promise<void> {
    const authorId = req.user;
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
  @Patch('/review/product')
  async patchReview(
    @Req() req,
    @Body() dto: PatchReviewBodyDto,
  ): Promise<void> {
    const authorId = req.user;
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
  @Delete('/review/product')
  async deleteReview(
    @Req() req,
    @Query() queryString: DeleteReviewQueryStringDTO,
  ): Promise<void> {
    const userId = req.user;
    const { reviewId } = queryString;
    const command = new DeleteReviewCommand(userId, reviewId);
    return await this.commandBus.execute(command);
  }

  // Query
  @Get('/review')
  async findReviewByProduct(
    @Query() queryString: FindReviewByProductQueryStringDTO,
  ): Promise<Review[]> {
    const { product, productId } = queryString;
    const query = new ByProductQuery(product, productId);
    return await this.queryBus.execute(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/review/user')
  async findReviewsByUser(
    @Req() req,
    @Query() queryString: FindReviewsByUserQueryStringDTO,
  ): Promise<Review[]> {
    const userId = req.user;
    const { productId } = queryString;
    const query = new FindReviewsByUserQuery(userId, productId);
    return this.queryBus.execute(query);
  }
}
