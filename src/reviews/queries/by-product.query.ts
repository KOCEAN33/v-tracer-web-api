import { IQuery } from '@nestjs/cqrs';

export class ByProductQuery implements IQuery {
  constructor(readonly product: string, readonly productId: string) {}
}
