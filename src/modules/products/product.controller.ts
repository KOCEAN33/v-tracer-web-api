import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProductDto } from './dto/create-product.dto';

import { CreateProductCommand } from './commands/create-product.command';

@Controller('product')
export class ProductController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    const { name, url } = dto;
    const command = new CreateProductCommand(name, url);
    return this.commandBus.execute(command);
  }
}