import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ProductRepository } from '../repositories/product.repository';
import { GetProductsListQueryHandler } from './get-products-list.handler';
import { GetProductsListQuery } from './get-products-list.query';

describe('CreatePostHandler', () => {
  let getProductsListQueryHandler: GetProductsListQueryHandler;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductsListQueryHandler,
        {
          provide: ProductRepository,
          useValue: {
            getProducts: jest.fn(),
          },
        },
      ],
    }).compile();

    getProductsListQueryHandler = module.get<GetProductsListQueryHandler>(
      GetProductsListQueryHandler,
    );
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  it('should be an instanceof UserLoginHandler', () => {
    expect(getProductsListQueryHandler).toBeInstanceOf(
      GetProductsListQueryHandler,
    );
  });

  it('should get products list', async () => {
    const products = [
      {
        id: 1,
        handle: 'JSON',
        name: 'json',
        companyId: null,
      },
      {
        id: 2,
        handle: 'notion',
        name: 'notion',
        companyId: null,
      },
    ];

    productRepository.getProducts = jest.fn().mockResolvedValue(products);

    const result = await getProductsListQueryHandler.execute(
      new GetProductsListQuery(),
    );

    expect(result).toEqual({
      message: 'success',
      products,
    });
  });

  it('should throw error if no products', async () => {
    const product = null;

    productRepository.getProductByProductHandle = jest
      .fn()
      .mockResolvedValue(product);

    expect(
      getProductsListQueryHandler.execute(new GetProductsListQuery()),
    ).rejects.toThrow(NotFoundException);
  });
});
