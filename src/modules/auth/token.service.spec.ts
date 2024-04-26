import { Test } from '@nestjs/testing';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { TokenExpiredError } from 'jsonwebtoken';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<TokenService>(TokenService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  // describe('generateTokens', () => {
  //   it('should generate access token and refresh token', () => {
  //     const payload = { userId: 1, role: 'USER' };
  //     const accessToken = 'access_token';
  //     const refreshToken = 'refresh_token';
  //
  //     jest.spyOn(jwtService, 'sign').mockReturnValueOnce({
  //       accessToken: accessToken,
  //       refreshToken: refreshToken,
  //     });
  //
  //     const tokens = service.generateTokens(payload);
  //
  //     expect(jwtService.sign).toHaveBeenCalledTimes(2);
  //     expect(tokens).toEqual({
  //       accessToken,
  //       refreshToken,
  //     });
  //   });
  // });

  describe('extractUserIdFromToken', () => {
    it('should extract user ID from token', () => {
      const token = 'refresh_token';
      const decodedToken = { userId: 1 };

      jest.spyOn(jwtService, 'verify').mockReturnValueOnce(decodedToken);
      jest.spyOn(configService, 'get').mockReturnValueOnce('refresh_secret');

      const result = service.extractUserIdFromToken(token);

      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'refresh_secret',
      });
      expect(result).toEqual(decodedToken);
    });

    it('should return false if token is expired', () => {
      const token = 'expired_token';
      const tokenExpiredError = new TokenExpiredError(
        'jwt expired',
        new Date(),
      );

      jest.spyOn(jwtService, 'verify').mockImplementationOnce(() => {
        throw tokenExpiredError;
      });
      jest.spyOn(configService, 'get').mockReturnValueOnce('refresh_secret');

      const result = service.extractUserIdFromToken(token);

      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'refresh_secret',
      });
      expect(result).toBe(false);
    });
  });
});
