import { ICommand } from '@nestjs/cqrs';
import type { Response } from 'express';

export class UserLogoutCommand implements ICommand {
  constructor(
    readonly response: Response,
    readonly userId: number,
    readonly refreshToken: string,
    readonly ip: string,
    readonly userAgent: string,
  ) {}
}
