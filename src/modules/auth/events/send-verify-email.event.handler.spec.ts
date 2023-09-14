import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

import { SendVerifyEmailEventHandler } from './send-verify-email.event.handler';
import { SendVerifyEmailEvent } from './send-verify-email.event';
import { SendVerifyEmailCommand } from '../../email/commands/send-verify-email.command';

describe('SaveTokenEventHandler', () => {
  let sendVerifyEmailEventHandler: SendVerifyEmailEventHandler;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SendVerifyEmailEventHandler,
        { provide: CommandBus, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    sendVerifyEmailEventHandler = moduleRef.get<SendVerifyEmailEventHandler>(
      SendVerifyEmailEventHandler,
    );
    commandBus = moduleRef.get<CommandBus>(CommandBus);
  });

  it('should be an instanceof SaveTokenEventHandler', () => {
    expect(sendVerifyEmailEventHandler).toBeInstanceOf(
      SendVerifyEmailEventHandler,
    );
  });

  it('should save new refresh token', async () => {
    const eventData = ['userId123', 'dev@example.com'] as const;

    const event = new SendVerifyEmailEvent(...eventData);
    await sendVerifyEmailEventHandler.handle(event);

    expect(commandBus.execute).toHaveBeenCalledWith(
      new SendVerifyEmailCommand(...eventData),
    );
  });
});
