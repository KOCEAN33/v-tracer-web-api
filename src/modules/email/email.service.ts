import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailgunService } from 'nestjs-mailgun';
import { MessagesSendResult } from 'mailgun.js';

import { EmailConfig } from '../../config/config.interface';
import { SendEmail } from './interface/send-email.interface';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailgunService: MailgunService,
  ) {}

  public async sendEmail(setup: SendEmail, html): Promise<MessagesSendResult> {
    const emailConfig = this.configService.get<EmailConfig>('email');
    const domain = emailConfig.domain;
    const sender = emailConfig.verifySender;

    const options = {
      from: sender,
      to: setup.receiver,
      subject: setup.subject,
      html: html,
      'o:testmode': process.env.NODE_ENV === 'development',
    };
    return await this.mailgunService.createEmail(domain, options);
  }

  public async compileVerifyEmail(data): Promise<string> {
    const source = await this.getEmailTemplate('email-verify.handlebars');
    const template = handlebars.compile(source);
    return template(data);
  }

  public setExpireDate(): Date {
    const emailConfig = this.configService.get<EmailConfig>('email');
    const expire = emailConfig.expiresIn;
    const now = new Date();
    return this.addMinutes(now, expire);
  }

  // date calculation
  private addMinutes(date: Date, minutes: number): Date {
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }

  // get email template from ./template folder
  private async getEmailTemplate(templateName: string): Promise<string> {
    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      'assets',
      'email',
      templateName,
    );
    return fs.readFileSync(templatePath, 'utf8');
  }
}
