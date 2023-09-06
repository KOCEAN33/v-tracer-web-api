import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import Mailgun, { MailgunMessageData } from 'mailgun.js';
import { ConfigService } from '@nestjs/config';
// import Handlebars from 'handlebars';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as path from 'path';
import { MailgunService } from 'nestjs-mailgun';
import * as process from 'process';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailgunService: MailgunService,
  ) {}

  public async emailCreate(email: string) {
    const options: MailgunMessageData = {
      from: 'tries.io <no-reply@tries.io>',
      to: email,
      subject: 'test',
      text: 'tesetsetsetst',
      // html: '',
      'o:testmode': process.env.NODE_ENV === 'development',
    };
    return await this.mailgunService.createEmail('tries.io', options);
  }

  public emailSender(receiver: string) {
    const APIKEY = this.configService.get<string>('MAILGUN_API_KEY');
    const DOMAIN = this.configService.get<string>('MAILGUN_DOMAIN');
    const mailgun = new Mailgun(FormData);
    const client = mailgun.client({
      username: 'tries',
      key: APIKEY,
    });
    const messageData = {
      from: 'tries.io <no-reply@tries.io>',
      to: receiver,
      // html: html,
      subject: 'Hello',
      text: 'this is test',
    };
    client.messages
      .create(DOMAIN, messageData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Return E-Mail HTML compiled with data
  private emailTemplateCompiler(templateName: string, data) {
    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'templates',
      'email',
      templateName,
    );
    const source = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(source);
    return template(data);
  }
}
