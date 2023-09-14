import { Test, TestingModule } from '@nestjs/testing';

import { AuthRepository } from '../repository/auth.repository';
import { SaveTokenEvent } from './save-token.event';
import { SaveTokenEventHandler } from './save-token.event.handler';

describe('SaveTokenEventHandler', () => {
  let saveTokenEventHandler: SaveTokenEventHandler;
  let authRepository: AuthRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SaveTokenEventHandler,
        { provide: AuthRepository, useValue: { saveRefreshToken: jest.fn() } },
      ],
    }).compile();

    saveTokenEventHandler = moduleRef.get<SaveTokenEventHandler>(
      SaveTokenEventHandler,
    );
    authRepository = moduleRef.get<AuthRepository, jest.Mocked<AuthRepository>>(
      AuthRepository,
    );
  });

  it('should be an instanceof SaveTokenEventHandler', () => {
    expect(saveTokenEventHandler).toBeInstanceOf(SaveTokenEventHandler);
  });

  it('should save new refresh token', async () => {
    const userAgent = {
      IP: '127.0.0.1',
      OS: 'windows',
      browser: 'Firefox',
      fingerprint: 'fingerprint',
    };
    const eventData = [
      '27359',
      'faceRefreshToken',
      userAgent,
      new Date(),
    ] as const;

    await saveTokenEventHandler.handle(new SaveTokenEvent(...eventData));

    expect(authRepository.saveRefreshToken).toHaveBeenCalledWith(...eventData);
  });
});
