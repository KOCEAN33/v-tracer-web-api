import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { AuthRepository } from '../repository/auth.repository';
import { UpdateTokenEvent } from './update-token.event';

@EventsHandler(UpdateTokenEvent)
export class UpdateTokenEventHandler
  implements IEventHandler<UpdateTokenEvent>
{
  constructor(private authRepository: AuthRepository) {}

  async handle(event: UpdateTokenEvent) {
    const { id, userId, refreshToken, ip, userAgent, fingerprint, expiresIn } =
      event;

    await this.authRepository.updateRefreshToken(
      id,
      userId,
      refreshToken,
      ip,
      userAgent,
      fingerprint,
      expiresIn,
    );
  }
}
