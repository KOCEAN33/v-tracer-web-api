import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { CreateProductHandler } from './commands/create-product.handler';
import { ProductRepository } from './repositories/product.repository';
import { CqrsModule } from '@nestjs/cqrs';
import {GetProductByHandleQuery} from "./queries/get-product.query";

const commandHandlers = [CreateProductHandler];

const queryHandlers = [GetProductByHandleQuery]

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
  providers: [ProductRepository, ...commandHandlers],
})
export class ProductModule {}
