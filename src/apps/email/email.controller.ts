import { Controller } from '@nestjs/common';

import { CommandBus } from '@nestjs/cqrs';

@Controller('/api/email')
export class EmailController {
  constructor(private commandBus: CommandBus) {}
}
