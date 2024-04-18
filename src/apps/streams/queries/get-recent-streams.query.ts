import { IQuery } from '@nestjs/cqrs';

export class GetRecentStreamsQuery implements IQuery {
  constructor() {}
}
