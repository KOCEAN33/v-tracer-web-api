import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { GetMyProfileHandler } from './get-my-profile.handler';
import { GetMyProfileQuery } from './get-my-profile.query';
import { UserRepository } from '../repository/user.repository';

describe('GetMyProfileHandler', () => {
  let handler: GetMyProfileHandler;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetMyProfileHandler,
        {
          provide: UserRepository,
          useValue: {
            getProfileByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get<GetMyProfileHandler>(GetMyProfileHandler);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  describe('execute', () => {
    it('should throw UnauthorizedException if userId is not provided', async () => {
      const query = new GetMyProfileQuery(null);

      await expect(handler.execute(query)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return user profile if userId is provided', async () => {
      const userId = 1;
      const userProfile = {
        user_id: userId,
        name: 'John Doe',
        image_url: 'https://example.com/image.jpg',
      };

      jest
        .spyOn(userRepository, 'getProfileByUserId')
        .mockResolvedValue(userProfile);

      const query = new GetMyProfileQuery(userId);
      const result = await handler.execute(query);

      expect(userRepository.getProfileByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        id: userId,
        name: 'John Doe',
        image: 'https://example.com/image.jpg',
      });
    });

    it('should return user profile with undefined image if image_url is null', async () => {
      const userId = 1;
      const userProfile = {
        user_id: userId,
        name: 'John Doe',
        image_url: null,
      };

      jest
        .spyOn(userRepository, 'getProfileByUserId')
        .mockResolvedValue(userProfile);

      const query = new GetMyProfileQuery(userId);
      const result = await handler.execute(query);

      expect(userRepository.getProfileByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        id: userId,
        name: 'John Doe',
      });
    });
  });
});
