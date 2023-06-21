import { IQuery } from '@nestjs/cqrs';

export class PublicGetReviewsQuery implements IQuery {
  constructor(readonly handle, readonly productId) {}
}
