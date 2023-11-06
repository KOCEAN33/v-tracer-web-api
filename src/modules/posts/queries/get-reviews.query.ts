import { IQuery } from '@nestjs/cqrs';

export class GetReviewsQuery implements IQuery {
  constructor(readonly productHandle: string) {}
}
