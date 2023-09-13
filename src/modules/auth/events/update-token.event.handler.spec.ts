import { Test, TestingModule } from '@nestjs/testing';

import { AuthRepository } from '../repository/auth.repository';
import { UpdateTokenEvent } from './update-token.event';
import { UpdateTokenEventHandler } from './update-token.event.handler';

describe('UpdateTokenEventHandler', () => {
  let updateTokenEventHandler: UpdateTokenEventHandler;
  let authRepository: AuthRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTokenEventHandler,
        {
          provide: AuthRepository,
          useValue: { updateRefreshToken: jest.fn() },
        },
      ],
    }).compile();

    updateTokenEventHandler = moduleRef.get<UpdateTokenEventHandler>(
      UpdateTokenEventHandler,
    );
    authRepository = moduleRef.get<AuthRepository, jest.Mocked<AuthRepository>>(
      AuthRepository,
    );
  });

  it('should be an instanceof SaveTokenEventHandler', () => {
    expect(updateTokenEventHandler).toBeInstanceOf(UpdateTokenEventHandler);
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
      'fakeRefreshToken',
      userAgent,
      new Date(),
    ] as const;

    const event = new UpdateTokenEvent(...eventData);
    await updateTokenEventHandler.handle(event);

    expect(authRepository.updateRefreshToken).toHaveBeenCalledWith(
      ...eventData,
    );
  });
});
