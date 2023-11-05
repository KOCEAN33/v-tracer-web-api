import { Logger, Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailgunModule } from 'nestjs-mailgun';
import { CqrsModule } from '@nestjs/cqrs';
import { SendVerifyEmailHandler } from './commands/send-verify-email.handler';
import { EmailRepository } from './repository/email.repository';

const commandHandler = [SendVerifyEmailHandler];

@Module({
  imports: [
    CqrsModule,
    MailgunModule.forAsyncRoot({
      useFactory: async () => {
        return {
          username: 'api',
          key: process.env.MAILGUN_API_KEY as string,
          timeout: 100000, // OPTIONAL, in milliseconds
        }
      }
    }),
  ],
  controllers: [EmailController],
  providers: [Logger, EmailRepository, EmailService, ...commandHandler],
  exports: [],
})
export class EmailModule {}
