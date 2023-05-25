import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { CreateProductHandler } from './commands/create-product.handler';
import { ProductRepository } from './repositories/product.repository';
import { CqrsModule } from '@nestjs/cqrs';

const commandHandlers = [CreateProductHandler];

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
  providers: [ProductRepository, ...commandHandlers],
})
export class ProductModule {}
