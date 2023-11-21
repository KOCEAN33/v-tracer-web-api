import { ICommand } from '@nestjs/cqrs';
import type { Response } from 'express';

export class GenerateTokenCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly provider: string,
    readonly externalId: string,
    readonly receivedAccessToken: string,
    readonly ip: string,
    readonly userAgent: string,
    readonly response: Response,
  ) {}
}
