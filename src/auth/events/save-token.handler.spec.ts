import { Test } from '@nestjs/testing';

import { SaveTokenHandler } from './save-token.handler';
import { SaveTokenEvent } from './save-token.event';
import { AuthRepository } from '../repository/auth.repository';

describe('SaveTokenHandler', () => {
  let saveTokenHandler: SaveTokenHandler;
  let authRepository: AuthRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SaveTokenHandler, { provide: AuthRepository, useValue: {} }],
    }).compile();

    saveTokenHandler = moduleRef.get<SaveTokenHandler>(SaveTokenHandler);
    authRepository = moduleRef.get<AuthRepository>(AuthRepository);
  });

  it('should save tokens', async () => {
    const event = new SaveTokenEvent('1', 'access_token', 'refresh_token');

    authRepository.saveToken = jest.fn().mockResolvedValue(undefined);

    await saveTokenHandler.handle(event);

    expect(authRepository.saveToken).toHaveBeenCalledWith(
      event.userId,
      event.accessToken,
      event.refreshToken,
    );
  });
});
