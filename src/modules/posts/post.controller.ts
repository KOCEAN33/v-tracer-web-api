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

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import type { Request } from 'express';
import { CreatePostCommand } from './commands/create-post.command';

@Controller('/api/post')
export class PostController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Req() req: Request, @Body() dto: CreatePostDto) {
    const { title, content, type, status, productHandle, userId } = dto;
    const command = new CreatePostCommand(
      title,
      content,
      type,
      status,
      productHandle,
      userId,
    );
    return this.commandBus.execute(command);
  }
}
