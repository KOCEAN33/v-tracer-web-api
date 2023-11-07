import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ProductController } from './product.controller';
import { ProductRepository } from './repositories/product.repository';
import { CreateProductHandler } from './commands/create-product.handler';
import { GetProductByHandleQueryHandler } from './queries/get-product.handler';
import { GetProductsListQueryHandler } from './queries/get-products-list.handler';

const commandHandlers = [CreateProductHandler];

const queryHandlers = [
  GetProductByHandleQueryHandler,
  GetProductsListQueryHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
  providers: [ProductRepository, ...commandHandlers, ...queryHandlers],
})
export class ProductModule {}
