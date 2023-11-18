import { ICommand } from '@nestjs/cqrs';
import type { Response } from 'express';

export class UserLoginCommand implements ICommand {
  constructor(
    readonly email: string,
    readonly password: string,
    readonly response: Response,
    readonly ip: string,
    readonly userAgent: string,
  ) {}
}
