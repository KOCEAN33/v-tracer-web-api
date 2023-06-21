import { IQuery } from '@nestjs/cqrs';

export class GetReviewsByUserIdQuery implements IQuery {
  constructor(readonly userId) {}
}
