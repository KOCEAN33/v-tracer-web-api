import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SaveTokenEvent } from './save-token.event';
import { AuthRepository } from '../repository/auth.repository';

@EventsHandler(SaveTokenEvent)
export class SaveTokenHandler implements IEventHandler<SaveTokenEvent> {
  constructor(private authRepository: AuthRepository) {}

  async handle(event: SaveTokenEvent) {
    const { userId, accessToken, refreshToken } = event as SaveTokenEvent;
    await this.authRepository.saveToken(userId, accessToken, refreshToken);
  }
}
