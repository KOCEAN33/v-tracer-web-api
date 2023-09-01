import { ICommand } from '@nestjs/cqrs';
import type { Response } from 'express';

export class RefreshTokenCommand implements ICommand {
  constructor(
    readonly receivedRefreshToken: string,
    readonly response: Response,
    readonly ip: string,
    readonly userAgent: string,
    readonly fingerprint: string,
  ) {}
}
