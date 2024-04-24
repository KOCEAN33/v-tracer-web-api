import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { SocialLoginHandler } from './social-login.handler';
import { SocialAuthService } from '../social-auth.service';
import { TokenService } from '../token.service';
import { SaveTokenEvent } from '../events/save-token.event';

describe('SocialLoginHandler', () => {
  let handler: SocialLoginHandler;
  let socialAuthService: SocialAuthService;
  let tokenService: TokenService;
  let jwtService: JwtService;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialLoginHandler,
        {
          provide: SocialAuthService,
          useValue: {
            socialAuthorization: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            generateTokens: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            decode: jest.fn(),
          },
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<SocialLoginHandler>(SocialLoginHandler);
    socialAuthService = module.get<SocialAuthService>(SocialAuthService);
    tokenService = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    eventBus = module.get<EventBus>(EventBus);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('execute', () => {
    const req = {};
    const res = {
      write: jest.fn(),
      end: jest.fn(),
      clearCookie: jest.fn(),
      cookie: jest.fn(),
    } as unknown as Response;
    const ip = '127.0.0.1';
    const userAgent = 'test-user-agent';

    it('should throw ForbiddenException if userData is null', async () => {
      jest
        .spyOn(socialAuthService, 'socialAuthorization')
        .mockResolvedValue(null);

      await expect(
        handler.execute({ req, res, ip, userAgent }),
      ).rejects.toThrow('can not verified');
    });

    it('should return conflict response if userData is "conflict"', async () => {
      jest
        .spyOn(socialAuthService, 'socialAuthorization')
        .mockResolvedValue('conflict');

      await handler.execute({ req, res, ip, userAgent });

      expect(res.write).toHaveBeenCalledWith(
        expect.stringContaining('this email is already in use'),
      );
      expect(res.end).toHaveBeenCalled();
    });

    it('should generate tokens, publish SaveTokenEvent, and return success response', async () => {
      interface userData {
        userId: number;
        role: 'USER';
      }
      const userData: userData = { userId: 1, role: 'USER' };
      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      const decodedJWT = { exp: Math.floor(Date.now() / 1000) + 3600 };

      jest
        .spyOn(socialAuthService, 'socialAuthorization')
        .mockResolvedValue(userData);
      jest.spyOn(tokenService, 'generateTokens').mockReturnValue(tokens);
      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedJWT);

      await handler.execute({ req, res, ip, userAgent });

      expect(tokenService.generateTokens).toHaveBeenCalledWith({
        userId: userData.userId,
        role: userData.role,
      });
      expect(eventBus.publish).toHaveBeenCalledWith(expect.any(SaveTokenEvent));
      expect(res.write).toHaveBeenCalledWith(
        expect.stringContaining('login success'),
      );
      expect(res.end).toHaveBeenCalled();
    });
  });
});
