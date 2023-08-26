import { Test } from '@nestjs/testing';
import { CreateReviewCommand } from './createReview.command';

import { ReviewRepository } from '../repositories/review.repository';
import { CreateReviewCommandHandler } from './createReview.handler';
import { UnauthorizedException } from '@nestjs/common';

describe('CreateReviewCommandHandler', () => {
  let commandHandler: CreateReviewCommandHandler;
  let reviewRepository;

  beforeEach(async () => {
    // Create a mock repository
    const mockRepository = {
      createReview: jest.fn(),
    };

    // Setup module for testing the CommandHandler
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateReviewCommandHandler,
        {
          provide: ReviewRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    commandHandler = moduleRef.get<CreateReviewCommandHandler>(
      CreateReviewCommandHandler,
    );
    reviewRepository = moduleRef.get<ReviewRepository>(ReviewRepository);
  });

  it('should call the createReview method of the reviewRepository', async () => {
    const command = new CreateReviewCommand(
      '1',
      '2',
      'Test Title',
      'Test Body',
      true,
    );

    await commandHandler.execute(command);

    expect(reviewRepository.createReview).toBeCalledWith(
      command.authorId,
      command.productId,
      command.title,
      command.body,
      expect.any(Date),
    );
  });

  it('should throw UnauthorizedException when authorId is not provided', async () => {
    const command = new CreateReviewCommand(
      '',
      '2',
      'Test Title',
      'Test Body',
      true,
    );

    await expect(commandHandler.execute(command)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
