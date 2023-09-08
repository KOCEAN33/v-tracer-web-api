import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailgunModule } from 'nestjs-mailgun';
import { CqrsModule } from '@nestjs/cqrs';
import { VerifyEmailHandler } from './commands/verify-email.handler';
import { EmailRepository } from './repository/email.repository';

const commandHandler = [VerifyEmailHandler];

@Module({
  imports: [
    CqrsModule,
    MailgunModule.forAsyncRoot({
      useFactory: async () => {
        return {
          username: 'api',
          key: process.env.MAILGUN_API_KEY,
          timeout: 100000, // OPTIONAL, in milliseconds
        };
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailRepository, EmailService, ...commandHandler],
  exports: [],
})
export class EmailModule {}
