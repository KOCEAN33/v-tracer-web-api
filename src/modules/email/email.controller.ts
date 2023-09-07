import { Controller, Post } from '@nestjs/common';

import { CommandBus } from '@nestjs/cqrs';
import { VerifyEmailCommand } from './commands/verify-email.command';

@Controller('/api/email')
export class EmailController {
  constructor(private commandBus: CommandBus) {}

  @Post('verify')
  async verify() {
    const userId = '6494ed4bcdebc4eb4c615c25';
    const email = 'iaasdm@xanny.us';
    const command = new VerifyEmailCommand(userId, email);
    return this.commandBus.execute(command);
  }
}
