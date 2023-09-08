import { EmailService } from '../email.service';
import { ConfigService } from '@nestjs/config';
import { EmailRepository } from '../repository/email.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { VerifyEmailHandler } from './verify-email.handler';
import { VerifyEmailCommand } from './verify-email.command';
import { InternalServerErrorException } from '@nestjs/common';

describe('VerifyEmailHandler', () => {
  let verifyEmailHandler: VerifyEmailHandler;
  let emailService: EmailService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        VerifyEmailHandler,
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
            saveVerifyToken: jest.fn(),
          },
        },
      ],
    }).compile();

    verifyEmailHandler = moduleRef.get<VerifyEmailHandler>(VerifyEmailHandler);
    emailService = moduleRef.get<EmailService>(EmailService);
  });

  it('should be an instanceof VerifyEmailHandler ', () => {
    expect(verifyEmailHandler).toBeInstanceOf(VerifyEmailHandler);
  });

  it('should send email to user', async () => {
    const commandData = ['userid', 'dev@example.com'] as const;
    const emailAddressValidate = { valid: true };
    const mail = { status: 200 };

    emailService.validateEmailAddress = jest
      .fn()
      .mockResolvedValue(emailAddressValidate);
    emailService.sendEmail = jest.fn().mockResolvedValue(mail);

    const result = await verifyEmailHandler.execute(
      new VerifyEmailCommand(...commandData),
    );
    expect(result).toEqual(mail);
  });

  it('should failed email address validation', async () => {
    const commandData = ['userid', 'dev@notvalid.com'] as const;
    const emailAddressValidate = { valid: false, status: 400, reason: 'smtp' };

    emailService.validateEmailAddress = jest
      .fn()
      .mockReturnValue(emailAddressValidate);

    expect(
      await verifyEmailHandler.execute(new VerifyEmailCommand(...commandData)),
    ).toEqual({
      status: 400,
      message: `Invalid email address : ${emailAddressValidate.reason}`,
    });
  });

  it('should throw Error when fail to send email', async () => {
    const commandData = ['userid', 'dev@example.com'] as const;
    const emailAddressValidate = { valid: true };
    const mail = { status: 400 };

    emailService.validateEmailAddress = jest
      .fn()
      .mockResolvedValue(emailAddressValidate);
    emailService.sendEmail = jest.fn().mockResolvedValue(mail);

    await expect(
      verifyEmailHandler.execute(new VerifyEmailCommand(...commandData)),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
