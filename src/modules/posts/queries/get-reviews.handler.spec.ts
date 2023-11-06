import { Test, TestingModule } from '@nestjs/testing';

import { PostRepository } from '../repositories/post.repository';

import { GetReviewsHandler } from './get-reviews.handler';
import { GetReviewsQuery } from './get-reviews.query';

describe('GetReviewsHandler', () => {
  let getReviewsHandler: GetReviewsHandler;
  let postRepository: PostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetReviewsHandler,
        {
          provide: PostRepository,
          useValue: {
            getReviewsByProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    getReviewsHandler = module.get<GetReviewsHandler>(GetReviewsHandler);
    postRepository = module.get<PostRepository>(PostRepository);
  });

  it('should be an instanceof UserLoginHandler', () => {
    expect(getReviewsHandler).toBeInstanceOf(GetReviewsHandler);
  });

  it('should return reviews', async () => {
    const commandData = ['productHandle'] as const;

    const mockReviews = [
      {
        id: 1,
        title: 'example1',
        body: 'this is example1',
        publishedAt: '2023-11-06T08:36:24.895Z',
        authorId: 18,
      },
      {
        id: 1,
        title: 'example2',
        body: 'this is example2',
        publishedAt: '2023-11-06T08:36:24.895Z',
        authorId: 18,
      },
    ];

    postRepository.getReviewsByProduct = jest
      .fn()
      .mockResolvedValue(mockReviews);

    const result = await getReviewsHandler.execute(
      new GetReviewsQuery(...commandData),
    );

    expect(result).toEqual({
      message: 'success',
      data: mockReviews,
    });
  });
});
