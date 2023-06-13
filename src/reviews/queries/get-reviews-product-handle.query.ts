import { IQuery } from '@nestjs/cqrs';

export class GetReviewsByProductHandleQuery implements IQuery {
  constructor(readonly productHandle) {}
}
