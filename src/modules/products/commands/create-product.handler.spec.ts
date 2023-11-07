import { Test, TestingModule } from '@nestjs/testing';

import { ConflictException } from '@nestjs/common';
import { CreateProductHandler } from './create-product.handler';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductCommand } from './create-product.command';

describe('CreatePostHandler', () => {
  let createProductHandler: CreateProductHandler;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductHandler,
        {
          provide: ProductRepository,
          useValue: {
            getProductByProductHandle: jest.fn(),
            createProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    createProductHandler =
      module.get<CreateProductHandler>(CreateProductHandler);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  it('should be an instanceof UserLoginHandler', () => {
    expect(createProductHandler).toBeInstanceOf(CreateProductHandler);
  });

  it('should create product', async () => {
    const commandData = [
      'productName',
      'productHandle',
      'http://example.com',
      0,
    ] as const;

    const checkHandle = null;

    const product = {
      insertId: 1n,
    };

    productRepository.getProductByProductHandle = jest
      .fn()
      .mockResolvedValue(checkHandle);
    productRepository.createProduct = jest.fn().mockResolvedValue(product);

    const result = await createProductHandler.execute(
      new CreateProductCommand(...commandData),
    );

    expect(result).toEqual({
      message: 'product created successfully',
      productId: 1,
    });
  });

  it('should throw error if no product handle conflict', async () => {
    const commandData = [
      'productName',
      'productHandle',
      'http://example.com',
      0,
    ] as const;

    const checkHandle = true;

    productRepository.getProductByProductHandle = jest
      .fn()
      .mockResolvedValue(checkHandle);

    expect(
      createProductHandler.execute(new CreateProductCommand(...commandData)),
    ).rejects.toThrow(ConflictException);
  });
});
