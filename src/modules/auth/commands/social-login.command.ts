import { ICommand } from '@nestjs/cqrs';
import type { Response } from 'express';

export class SocialLoginCommand implements ICommand {
  constructor(
    readonly req: any,
    readonly res: Response,
    readonly ip: string,
    readonly userAgent: string,
  ) {}
}
