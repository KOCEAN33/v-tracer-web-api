import { Controller, Get, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('/api/email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('test')
  async sendmail() {
    return await this.emailService.emailCreate('iam@xanny.us');
  }

  // @Get('template')
  // async template() {
  //   return this.emailService.emailTemplate('email-verify.handlebars');
  // }
}
