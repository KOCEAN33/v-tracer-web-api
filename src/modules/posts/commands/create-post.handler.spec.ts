import { Test, TestingModule } from '@nestjs/testing';

import { CreatePostCommandHandler } from './create-post.handler';
import { PostRepository } from '../repositories/post.repository';

import { CreatePostCommand } from './create-post.command';
import { NotFoundException } from '@nestjs/common';

describe('CreatePostHandler', () => {
  let createPostHandler: CreatePostCommandHandler;
  let postRepository: PostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePostCommandHandler,
        {
          provide: PostRepository,
          useValue: {
            getProductByHandle: jest.fn(),
            createPost: jest.fn(),
          },
        },
      ],
    }).compile();

    createPostHandler = module.get<CreatePostCommandHandler>(
      CreatePostCommandHandler,
    );
    postRepository = module.get<PostRepository>(PostRepository);
  });

  it('should be an instanceof UserLoginHandler', () => {
    expect(createPostHandler).toBeInstanceOf(CreatePostCommandHandler);
  });

  it('should create post', async () => {
    const commandData = [
      'title',
      'body',
      'review',
      'published',
      'productHandle',
      0,
    ] as const;

    const mockProduct = {
      id: 1,
      name: 'EXAMPLE',
      handle: 'productHandle',
    };

    const post = {
      insertId: 1n,
    };

    postRepository.getProductByHandle = jest
      .fn()
      .mockResolvedValue(mockProduct);
    postRepository.createPost = jest.fn().mockResolvedValue(post);

    const result = await createPostHandler.execute(
      new CreatePostCommand(...commandData),
    );

    expect(result).toEqual({
      message: 'post success',
      data: 1,
    });
  });

  it('should throw error if no product exist', async () => {
    const commandData = [
      'title',
      'body',
      'review',
      'published',
      'productHandle',
      0,
    ] as const;

    const mockProduct = null;

    postRepository.getProductByHandle = jest
      .fn()
      .mockResolvedValue(mockProduct);

    expect(
      createPostHandler.execute(new CreatePostCommand(...commandData)),
    ).rejects.toThrow(NotFoundException);
  });
});
