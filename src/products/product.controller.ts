import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductDto } from './dtos/create-product.dto';

import { CreateProductCommand } from './commands/create-product.command';

@Controller('products')
export class ProductController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Post('/create')
  async createProduct(@Body() dto: CreateProductDto) {
    const { name, url } = dto;
    const command = new CreateProductCommand(name, url);
    return this.commandBus.execute(command);
  }
}
