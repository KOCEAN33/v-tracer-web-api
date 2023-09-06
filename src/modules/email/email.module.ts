import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailgunModule } from 'nestjs-mailgun';

@Module({
  imports: [
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
  providers: [EmailService],
  exports: [],
})
export class EmailModule {}
