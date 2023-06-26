import { IQuery } from '@nestjs/cqrs';

export class FindReviewByProductQuery implements IQuery {
  constructor(readonly product: string, readonly productId: string) {}
}
