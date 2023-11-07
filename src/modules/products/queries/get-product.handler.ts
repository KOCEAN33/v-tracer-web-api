import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { GetProductByHandleQuery } from './get-product.query';
import { ProductRepository } from '../repositories/product.repository';

@QueryHandler(GetProductByHandleQuery)
export class GetProductByHandleQueryHandler
  implements IQueryHandler<GetProductByHandleQuery>
{
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(query: GetProductByHandleQuery) {
    const { productHandle } = query;

    const product =
      await this.productRepository.getProductByProductHandle(productHandle);

    if (!product) {
      throw new NotFoundException('product not found');
    }

    return { message: 'success', product };
  }
}
