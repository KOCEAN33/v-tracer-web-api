import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { EmailService } from '../email.service';
import { EmailRepository } from '../repository/email.repository';
import { SendVerifyEmailHandler } from './send-verify-email.handler';
import { SendVerifyEmailCommand } from './send-verify-email.command';

describe('VerifyEmailHandler', () => {
  let sendVerifyEmailHandler: SendVerifyEmailHandler;
  let emailService: EmailService;
  let emailRepository: EmailRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SendVerifyEmailHandler,
        ConfigService,
        Logger,
        {
          provide: EmailService,
          useValue: {
            compileVerifyEmail: jest.fn(),
            setExpireDate: jest.fn(),
            sendEmail: jest.fn(),
          },
        },
        {
          provide: EmailRepository,
          useValue: {
            invalidateOldToken: jest.fn(),
            createVerifyToken: jest.fn(),
          },
        },
      ],
    }).compile();

    sendVerifyEmailHandler = moduleRef.get<SendVerifyEmailHandler>(
      SendVerifyEmailHandler,
    );
    emailService = moduleRef.get<EmailService>(EmailService);
    emailRepository = moduleRef.get<EmailRepository>(EmailRepository);
  });

  it('should be an instanceof SendVerifyEmailHandler ', () => {
    expect(sendVerifyEmailHandler).toBeInstanceOf(SendVerifyEmailHandler);
  });

  it('should send email to user', async () => {
    const commandData = [10, 'dev@example.com'] as const;
    const mail = { status: 200 };

    emailService.sendEmail = jest.fn().mockResolvedValue(mail);

    const result = await sendVerifyEmailHandler.execute(
      new SendVerifyEmailCommand(...commandData),
    );
    expect(result).toEqual({ success: mail });
    expect(emailRepository.invalidateOldToken).toHaveBeenCalledWith(10);
  });
});
