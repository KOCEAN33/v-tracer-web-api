import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { AuthRepository } from '../repository/auth.repository';
import { SaveTokenEvent } from './save-token.event';

@EventsHandler(SaveTokenEvent)
export class SaveTokenEventHandler implements IEventHandler<SaveTokenEvent> {
  constructor(private authRepository: AuthRepository) {}

  async handle(event: SaveTokenEvent) {
    const { userId, refreshToken, ip, userAgent, expiresIn } = event;

    await this.authRepository.saveRefreshToken(
      userId,
      refreshToken,
      ip,
      userAgent,
      expiresIn,
    );
  }
}
