import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProductDto } from './dto/create-product.dto';

import { CreateProductCommand } from './commands/create-product.command';

@Controller('product')
export class ProductController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    const { name, handle, url, companyId } = dto;
    const command = new CreateProductCommand(name, handle, url, companyId);
    return this.commandBus.execute(command);
  }
}
