import { ICommand } from '@nestjs/cqrs';

export class RefreshTokenCommand implements ICommand {
  constructor(readonly userId: string, readonly receiveRefreshToken: string) {}
}
