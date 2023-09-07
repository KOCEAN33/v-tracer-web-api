import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';

import { VerifyEmailCommand } from './verify-email.command';
import { EmailService } from '../email.service';
import { EmailRepository } from '../repository/email.repository';
import { EmailConfig } from '../../../common/config/config.interface';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly emailRepository: EmailRepository,
  ) {}

  //TODO: verify email address before send
  //TODO: check after send

  async execute(command: VerifyEmailCommand) {
    const { userId, email } = command;

    const clientUrl = this.configService.get<string>('CLIENT_URL');
    const uuid = v4();
    // User receive this URL to verify email
    const verifyURL = `${clientUrl}/email/verify/${userId}?confirmationCode=${uuid}`;

    // Get compiled HTML file
    const data = { url: verifyURL };
    const html = await this.emailService.compileVerifyEmail(data);

    // Set Expire time
    const expiresIn = this.emailService.setExpireDate();

    // Setup for send mail
    const setup = { receiver: email, subject: '이메일을 인증해주세요' };

    // Save and Send it
    await this.emailRepository.saveVerifyToken(userId, email, uuid, expiresIn);
    const result = await this.emailService.sendEmail(setup, html);

    if (result.status === 200) {
      return result;
    }
  }
}
