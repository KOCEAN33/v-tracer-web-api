import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { AuthRepository } from '../repository/auth.repository';
import { UpdateTokenEvent } from './update-token.event';

@EventsHandler(UpdateTokenEvent)
export class UpdateTokenEventHandler
  implements IEventHandler<UpdateTokenEvent>
{
  constructor(private authRepository: AuthRepository) {}

  async handle(event: UpdateTokenEvent) {
    const { id, refreshToken, ip, os, fingerprint, expiresIn } =
      event as UpdateTokenEvent;

    await this.authRepository.updateRefreshToken(
      id,
      refreshToken,
      ip,
      os,
      fingerprint,
      expiresIn,
    );
  }
}
