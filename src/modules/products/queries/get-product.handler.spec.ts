import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ProductRepository } from '../repositories/product.repository';
import { GetProductByHandleQueryHandler } from './get-product.handler';
import { GetProductByHandleQuery } from './get-product.query';

describe('CreatePostHandler', () => {
  let getProductByHandleQueryHandler: GetProductByHandleQueryHandler;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductByHandleQueryHandler,
        {
          provide: ProductRepository,
          useValue: {
            getProductByProductHandle: jest.fn(),
          },
        },
      ],
    }).compile();

    getProductByHandleQueryHandler = module.get<GetProductByHandleQueryHandler>(
      GetProductByHandleQueryHandler,
    );
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  it('should be an instanceof UserLoginHandler', () => {
    expect(getProductByHandleQueryHandler).toBeInstanceOf(
      GetProductByHandleQueryHandler,
    );
  });

  it('should get product', async () => {
    const queryData = ['productHandle'] as const;

    const product = {
      id: 1,
      handle: 'JSON',
      name: 'json',
      companyId: null,
    };

    productRepository.getProductByProductHandle = jest
      .fn()
      .mockResolvedValue(product);

    const result = await getProductByHandleQueryHandler.execute(
      new GetProductByHandleQuery(...queryData),
    );

    expect(result).toEqual({
      message: 'success',
      product,
    });
  });

  it('should throw error if no product handle conflict', async () => {
    const queryData = ['productHandle'] as const;

    const product = null;

    productRepository.getProductByProductHandle = jest
      .fn()
      .mockResolvedValue(product);

    expect(
      getProductByHandleQueryHandler.execute(
        new GetProductByHandleQuery(...queryData),
      ),
    ).rejects.toThrow(NotFoundException);
  });
});
