import { ICommand } from '@nestjs/cqrs';
import { Request, Response } from 'express';

export class RefreshTokenCommand implements ICommand {
  constructor(
    readonly receiveRefreshToken: string,
    readonly response: Response,
  ) {}
}
