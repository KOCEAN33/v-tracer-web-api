import { Controller, Post } from '@nestjs/common';

import { CommandBus } from '@nestjs/cqrs';
import { SendVerifyEmailCommand } from './commands/send-verify-email.command';

@Controller('/api/email')
export class EmailController {
  constructor(private commandBus: CommandBus) {}

  @Post('verify')
  async verify() {
    const userId = '6494ed4bcdebc4eb4c615c25';
    const email = 'tagasdon8054@gmail.com';
    const command = new SendVerifyEmailCommand(userId, email);
    return this.commandBus.execute(command);
  }

  // resend the email
}
