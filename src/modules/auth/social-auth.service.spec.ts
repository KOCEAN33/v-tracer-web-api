import { Test } from '@nestjs/testing';
import { SocialAuthService } from './social-auth.service';
import { AuthRepository } from './repository/auth.repository';

describe('SocialAuthService', () => {
  let service: SocialAuthService;
  let repository: AuthRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SocialAuthService,
        {
          provide: AuthRepository,
          useValue: {
            getUserBySocialId: jest.fn(),
            getUserByEmail: jest.fn(),
            createSocialAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<SocialAuthService>(SocialAuthService);
    repository = moduleRef.get<AuthRepository>(AuthRepository);
  });

  describe('socialAuthorization', () => {
    it('should return user details if the user exists with the given social ID', async () => {
      const req = {
        user: {
          email: 'test@example.com',
          name: 'Test User',
          picture: 'test.jpg',
          provider: 'google',
          externalId: '123456',
          accessToken: 'abc123',
        },
      };

      const existingUser = {
        user_id: 1,
        provider: 'google',
        external_id: '123456',
        role: 'USER' as const,
      };

      jest
        .spyOn(repository, 'getUserBySocialId')
        .mockResolvedValue(existingUser);

      const result = await service.socialAuthorization(req);

      expect(repository.getUserBySocialId).toHaveBeenCalledWith(
        req.user.externalId,
        req.user.provider,
      );
      expect(result).toEqual({
        userId: existingUser.user_id,
        role: existingUser.role,
      });
    });

    it('should create a new user if the user does not exist with the given social ID and email', async () => {
      const req = {
        user: {
          email: 'test@example.com',
          name: 'Test User',
          picture: 'test.jpg',
          provider: 'google',
          externalId: '123456',
          accessToken: 'abc123',
        },
      };

      const newUser = {
        id: 1,
        role: 'USER' as const,
      };

      jest.spyOn(repository, 'getUserBySocialId').mockResolvedValue(null);
      jest.spyOn(repository, 'getUserByEmail').mockResolvedValue(null);
      jest.spyOn(repository, 'createSocialAccount').mockResolvedValue(newUser);

      const result = await service.socialAuthorization(req);

      expect(repository.getUserBySocialId).toHaveBeenCalledWith(
        req.user.externalId,
        req.user.provider,
      );
      expect(repository.getUserByEmail).toHaveBeenCalledWith(req.user.email);
      expect(repository.createSocialAccount).toHaveBeenCalledWith(
        req.user.email,
        req.user.name,
        req.user.picture,
        req.user.provider,
        req.user.externalId,
        req.user.accessToken,
      );
      expect(result).toEqual({ userId: newUser.id, role: newUser.role });
    });

    it('should return "conflict" if the user does not exist with the given social ID but exists with the same email', async () => {
      const req = {
        user: {
          email: 'test@example.com',
          name: 'Test User',
          picture: 'test.jpg',
          provider: 'google',
          externalId: '123456',
          accessToken: 'abc123',
        },
      };

      const existingUser = {
        id: 1,
        email: 'test@example.com',
        created_at: new Date(),
        role: 'USER' as const,
        is_verified: 1,
      };

      jest.spyOn(repository, 'getUserBySocialId').mockResolvedValue(null);
      jest.spyOn(repository, 'getUserByEmail').mockResolvedValue(existingUser);

      const result = await service.socialAuthorization(req);

      expect(repository.getUserBySocialId).toHaveBeenCalledWith(
        req.user.externalId,
        req.user.provider,
      );
      expect(repository.getUserByEmail).toHaveBeenCalledWith(req.user.email);
      expect(result).toBe('conflict');
    });
  });
});
