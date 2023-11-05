import { ICommand } from '@nestjs/cqrs';

export class CreateProductCommand implements ICommand {
  constructor(
    readonly name: string,
    readonly handle: string,
    readonly url: string,
    readonly companyId: number,
  ) {}
}
