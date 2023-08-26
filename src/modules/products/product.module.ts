import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ProductController } from './product.controller';
import { ProductRepository } from './repositories/product.repository';
import { CreateProductHandler } from './commands/create-product.handler';
import { GetProductByHandleQuery } from './queries/get-product.query';

const commandHandlers = [CreateProductHandler];

const queryHandlers = [GetProductByHandleQuery];

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
  providers: [ProductRepository, ...commandHandlers],
})
export class ProductModule {}
