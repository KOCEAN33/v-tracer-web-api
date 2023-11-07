import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductDto } from './dto/create-product.dto';

import { CreateProductCommand } from './commands/create-product.command';
import { GetProductDto } from './dto/get-product.dto';
import { GetProductByHandleQuery } from './queries/get-product.query';
import { GetProductsListQuery } from './queries/get-products-list.query';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('/api/products')
export class ProductController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    const { name, handle, url, companyId } = dto;
    const command = new CreateProductCommand(name, handle, url, companyId);
    return this.commandBus.execute(command);
  }

  @Get('/search')
  async getProductByHandle(@Body() dto: GetProductDto) {
    const { productHandle } = dto;
    const query = new GetProductByHandleQuery(productHandle);
    return this.queryBus.execute(query);
  }

  @Get('all')
  async getAllProducts() {
    const query = new GetProductsListQuery();
    return this.queryBus.execute(query);
  }
}
