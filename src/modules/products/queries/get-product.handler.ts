import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Product } from '@prisma/client';

import { GetProductByHandleQuery } from './get-product.query';
import { ProductRepository } from '../repositories/product.repository';

@QueryHandler(GetProductByHandleQuery)
export class GetProductByHandleHandler
  implements IQueryHandler<GetProductByHandleQuery>
{
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(query: GetProductByHandleQuery) {
    // const { handle } = query;
    //
    // return await this.productRepository.getProductByProductHandle(handle);
  }
}
