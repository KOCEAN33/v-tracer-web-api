import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';

import { VerifyEmailCommand } from './verify-email.command';
import { EmailService } from '../email.service';
import { EmailRepository } from '../repository/email.repository';
import type { MessagesSendResult } from 'mailgun.js';

interface VerifyEmailCommandInterface {
  status: number;
  id?: string;
  message?: string;
}

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly emailRepository: EmailRepository,
  ) {}

  //TODO: check after send

  async execute(
    command: VerifyEmailCommand,
  ): Promise<VerifyEmailCommandInterface> {
    const { userId, email } = command;

    const emailAddressValidate =
      await this.emailService.validateEmailAddress(email);

    if (!emailAddressValidate.valid) {
      return {
        status: 400,
        message: `Invalid email address : ${emailAddressValidate.reason}`,
      };
    }

    // Invalidate old tokens
    await this.emailRepository.invalidateOldToken(userId);

    const clientUrl = this.configService.get<string>('CLIENT_URL');
    const token = v4();
    // User receive this URL to verify email
    const verifyURL = `${clientUrl}/verify/email/?id=${userId}&confirmationCode=${token}`;

    // Get compiled HTML file
    const data = { url: verifyURL };
    const html = await this.emailService.compileVerifyEmail(data);

    // Set Expire time
    const expiresIn = this.emailService.setExpireDate();

    // Setup for send mail
    const setup = { receiver: email, subject: '이메일을 인증해주세요' };

    // Save and Send it
    const [, mail]: [void, MessagesSendResult] = await Promise.all([
      await this.emailRepository.saveVerifyToken(
        userId,
        email,
        token,
        expiresIn,
      ),
      await this.emailService.sendEmail(setup, html),
    ]);
    if (mail.status === 200) {
      return mail;
    }

    throw new Error('Failed to send email');
  }
}
