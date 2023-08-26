import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateTokenEvent } from './update-token.event';
import { AuthRepository } from '../repository/auth.repository';

@EventsHandler(UpdateTokenEvent)
export class UpdateTokenHandler implements IEventHandler<UpdateTokenEvent> {
  constructor(private authRepository: AuthRepository) {}

  async handle(event: UpdateTokenEvent) {
    const { userId, accessToken, refreshToken } = event as UpdateTokenEvent;
    await this.authRepository.updateToken(userId, accessToken, refreshToken);
  }
}
