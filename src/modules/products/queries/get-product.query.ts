import { IQuery } from '@nestjs/cqrs';

export class GetProductByHandleQuery implements IQuery {
  constructor(readonly productHandle: string) {}
}
