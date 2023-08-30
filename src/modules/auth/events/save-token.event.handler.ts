import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { AuthRepository } from '../repository/auth.repository';
import { SaveTokenEvent } from './save-token.event';

@EventsHandler(SaveTokenEvent)
export class SaveTokenEventHandler implements IEventHandler<SaveTokenEvent> {
  constructor(private authRepository: AuthRepository) {}

  async handle(event: SaveTokenEvent) {
    const { userId, refreshToken, ip, os, fingerprint, expiresIn } =
      event as SaveTokenEvent;

    await this.authRepository.saveRefreshToken(
      userId,
      refreshToken,
      ip,
      os,
      fingerprint,
      expiresIn,
    );
  }
}