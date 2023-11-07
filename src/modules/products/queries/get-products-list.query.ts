import { IQuery } from '@nestjs/cqrs';

export class GetProductsListQuery implements IQuery {
  constructor() {}
}
