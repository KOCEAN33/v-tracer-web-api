import { IQuery } from '@nestjs/cqrs';

export class FindReviewsByUserQuery implements IQuery {
  constructor(readonly userId: string, readonly productId: string) {}
}
