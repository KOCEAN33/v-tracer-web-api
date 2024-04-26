import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from './password.service';
import { SecurityConfig } from '../../config/config.interface';
import * as bcrypt from 'bcrypt';

describe('PasswordService', () => {
  let service: PasswordService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PasswordService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              bcryptSaltOrRound: 10,
            }),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<PasswordService>(PasswordService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe('bcryptSaltRounds', () => {
    it('should return the bcryptSaltRounds from the security config', () => {
      expect(service.bcryptSaltRounds).toBe(10);
    });
  });

  describe('validatePassword', () => {
    it('should return true if the password matches the hashed password', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await service.validatePassword(password, hashedPassword);

      expect(result).toBe(true);
    });

    it('should return false if the password does not match the hashed password', async () => {
      const password = 'password123';
      const incorrectPassword = 'incorrect';
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await service.validatePassword(
        incorrectPassword,
        hashedPassword,
      );

      expect(result).toBe(false);
    });
  });

  describe('hashPassword', () => {
    it('should hash the password using the configured bcryptSaltRounds', async () => {
      const password = 'password123';

      jest.spyOn(bcrypt, 'hash');

      const hashedPassword = await service.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(hashedPassword).toBeDefined();
    });
  });
});
