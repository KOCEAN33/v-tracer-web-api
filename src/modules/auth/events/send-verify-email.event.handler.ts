import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SendVerifyEmailEvent } from './send-verify-email.event';
import { SendVerifyEmailCommand } from '../../email/commands/send-verify-email.command';

@EventsHandler(SendVerifyEmailEvent)
export class SendVerifyEmailEventHandler
  implements IEventHandler<SendVerifyEmailEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: SendVerifyEmailEvent) {
    const { userId, email } = event as SendVerifyEmailEvent;

    const verifyEmailCommand = new SendVerifyEmailCommand(userId, email);
    await this.commandBus.execute(verifyEmailCommand);
  }
}
