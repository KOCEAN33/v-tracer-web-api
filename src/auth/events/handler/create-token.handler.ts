import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../repository/auth.repository';
import { CreateNewTokenEvent } from '../create-token.event';

@EventsHandler(CreateNewTokenEvent)
export class CreateNewTokenHandler
  implements IEventHandler<CreateNewTokenEvent>
{
  constructor(private authRepository: AuthRepository) {}

  async handle(event: CreateNewTokenEvent) {
    const { userId, accessToken, refreshToken } = event as CreateNewTokenEvent;
    await this.authRepository.createNewToken(userId, accessToken, refreshToken);
  }
}
