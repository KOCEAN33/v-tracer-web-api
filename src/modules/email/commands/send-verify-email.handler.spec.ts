import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { EmailService } from '../email.service';
import { EmailRepository } from '../repository/email.repository';
import { SendVerifyEmailHandler } from './send-verify-email.handler';
import { SendVerifyEmailCommand } from './send-verify-email.command';

describe('VerifyEmailHandler', () => {
  let verifyEmailHandler: SendVerifyEmailHandler;
  let emailService: EmailService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SendVerifyEmailHandler,
        { provide: ConfigService, useValue: { get: jest.fn } },
        {
          provide: EmailService,
          useValue: {
            validateEmailAddress: jest.fn(),
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
            updateUserStatusEmailNotExist: jest.fn(),
          },
        },
      ],
    }).compile();

    verifyEmailHandler = moduleRef.get<SendVerifyEmailHandler>(
      SendVerifyEmailHandler,
    );
    emailService = moduleRef.get<EmailService>(EmailService);
  });

  it('should be an instanceof SendVerifyEmailHandler ', () => {
    expect(verifyEmailHandler).toBeInstanceOf(SendVerifyEmailHandler);
  });

  it('should send email to user', async () => {
    const commandData = ['userId', 'dev@example.com'] as const;
    const emailAddressValidate = { valid: true };
    const mail = { status: 200 };

    emailService.validateEmailAddress = jest
      .fn()
      .mockResolvedValue(emailAddressValidate);
    emailService.sendEmail = jest.fn().mockResolvedValue(mail);

    const result = await verifyEmailHandler.execute(
      new SendVerifyEmailCommand(...commandData),
    );
    expect(result).toEqual(mail);
  });

  it('should throw NotFoundException if email address does not exist', async () => {
    const commandData = ['userid', 'dev@notvalid.com'] as const;
    const emailAddressValidate = { valid: false, status: 400, reason: 'smtp' };

    emailService.validateEmailAddress = jest
      .fn()
      .mockReturnValue(emailAddressValidate);

    expect(
      verifyEmailHandler.execute(new SendVerifyEmailCommand(...commandData)),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw Error when fail to send email', async () => {
    // TODO: need logic to handle email send error
    // const commandData = ['userid', 'dev@example.com'] as const;
    // const emailAddressValidate = { valid: true };
    // const mail = { status: 400 };
    //
    // emailService.validateEmailAddress = jest
    //   .fn()
    //   .mockResolvedValue(emailAddressValidate);
    // emailService.sendEmail = jest.fn().mockResolvedValue(mail);
    //
    // await expect(
    //   verifyEmailHandler.execute(new SendVerifyEmailCommand(...commandData)),
    // ).rejects.toThrow(InternalServerErrorException);
  });
});
