import { Test } from '@nestjs/testing';

import { GetUserFromTokenHandler } from './get-user.handler';
import { GetUserFromTokenQuery } from '../get-user.query';
import { AuthRepository } from '../../repository/auth.repository';

describe('GetUserFromTokenHandler', () => {
  let getUserFromTokenHandler: GetUserFromTokenHandler;
  let authRepository: AuthRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetUserFromTokenHandler,
        { provide: AuthRepository, useValue: {} },
      ],
    }).compile();

    getUserFromTokenHandler = moduleRef.get<GetUserFromTokenHandler>(
      GetUserFromTokenHandler,
    );
    authRepository = moduleRef.get<AuthRepository>(AuthRepository);
  });

  it('should get user by id', async () => {
    const query = new GetUserFromTokenQuery('1');
    const user = { id: '1', email: 'test@email.com' };

    authRepository.getUserById = jest.fn().mockResolvedValue(user);

    const result = await getUserFromTokenHandler.execute(query);

    expect(result).toEqual(user);
    expect(authRepository.getUserById).toHaveBeenCalledWith(query.userId);
  });
});
