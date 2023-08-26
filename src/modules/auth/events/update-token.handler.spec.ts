import { Test } from '@nestjs/testing';

import { UpdateTokenHandler } from './update-token.handler';
import { UpdateTokenEvent } from './update-token.event';
import { AuthRepository } from '../repository/auth.repository';

describe('UpdateTokenHandler', () => {
  let updateTokenHandler: UpdateTokenHandler;
  let authRepository: AuthRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateTokenHandler,
        { provide: AuthRepository, useValue: {} },
      ],
    }).compile();

    updateTokenHandler = moduleRef.get<UpdateTokenHandler>(UpdateTokenHandler);
    authRepository = moduleRef.get<AuthRepository>(AuthRepository);
  });

  it('should update tokens', async () => {
    const event = new UpdateTokenEvent('1', 'access_token', 'refresh_token');

    authRepository.updateToken = jest.fn().mockResolvedValue(undefined);

    await updateTokenHandler.handle(event);

    expect(authRepository.updateToken).toHaveBeenCalledWith(
      event.userId,
      event.accessToken,
      event.refreshToken,
    );
  });
});
