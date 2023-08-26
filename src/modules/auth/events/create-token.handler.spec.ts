import { Test } from '@nestjs/testing';

import { UpdateTokenEvent } from './update-token.event';
import { AuthRepository } from '../repository/auth.repository';
import { CreateNewTokenHandler } from './create-token.handler';

describe('CreateNewTokenHandler', () => {
  let createNewTokenHandler: CreateNewTokenHandler;
  let authRepository: AuthRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateNewTokenHandler,
        { provide: AuthRepository, useValue: {} },
      ],
    }).compile();

    createNewTokenHandler = moduleRef.get<CreateNewTokenHandler>(
      CreateNewTokenHandler,
    );
    authRepository = moduleRef.get<AuthRepository>(AuthRepository);
  });

  it('should create new tokens', async () => {
    const event = new UpdateTokenEvent('1', 'access_token', 'refresh_token');

    authRepository.createNewToken = jest.fn().mockResolvedValue(undefined);

    await createNewTokenHandler.handle(event);

    expect(authRepository.createNewToken).toHaveBeenCalledWith(
      event.userId,
      event.accessToken,
      event.refreshToken,
    );
  });
});
