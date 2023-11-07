import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { ProductRepository } from '../repositories/product.repository';
import { GetProductsListQuery } from './get-products-list.query';

@QueryHandler(GetProductsListQuery)
export class GetProductsListQueryHandler
  implements IQueryHandler<GetProductsListQuery>
{
  constructor(private readonly productRepository: ProductRepository) {}

  async execute() {
    const products = await this.productRepository.getProducts();

    if (!products) {
      throw new NotFoundException('products not found');
    }

    return { message: 'success', products };
  }
}
