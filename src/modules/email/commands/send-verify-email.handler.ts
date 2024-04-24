import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import type { MessagesSendResult } from 'mailgun.js';

import { SendVerifyEmailCommand } from './send-verify-email.command';
import { EmailService } from '../email.service';
import { EmailRepository } from '../repository/email.repository';

@CommandHandler(SendVerifyEmailCommand)
export class SendVerifyEmailHandler
  implements ICommandHandler<SendVerifyEmailCommand>
{
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly emailRepository: EmailRepository,
    private readonly logger: Logger,
  ) {}

  //TODO: check after send

  async execute(command: SendVerifyEmailCommand) {
    const { userId, email } = command;

    // Invalidate old tokens
    await this.emailRepository.invalidateOldToken(userId);

    const clientUrl = this.configService.get<string>('CLIENT_URL');
    const token = this.generateRandomString(12);
    // User receive this URL to verify email
    const verifyURL = `${clientUrl}/verify/email/?verifyCode=${token}`;

    // Get compiled HTML file
    const data = { url: verifyURL };
    const html = await this.emailService.compileVerifyEmail(data);

    // Set Expire time
    const expiresIn = this.emailService.setExpireDate();

    // Setup for send mail
    const setup = { receiver: email, subject: '이메일을 인증해주세요' };

    // Save and Send it
    const [, mail]: [void, MessagesSendResult] = await Promise.all([
      await this.emailRepository.createVerifyToken(userId, token, expiresIn),
      await this.emailService.sendEmail(setup, html),
    ]);

    if (mail.status == 200) {
      return { success: mail };
    }

    this.logger.error({
      address: email,
      message: mail?.message,
      detail: mail?.details,
    });
  }

  private generateRandomString(length) {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset[randomIndex];
    }
    return randomString;
  }
}
