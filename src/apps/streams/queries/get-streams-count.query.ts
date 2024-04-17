import { IQuery } from '@nestjs/cqrs';

export class GetStreamsCountQuery implements IQuery {
  constructor() {}
}
