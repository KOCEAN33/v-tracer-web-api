import { IQuery } from '@nestjs/cqrs';

export class GetUserFromTokenQuery implements IQuery {
  constructor(readonly userId: string) {}
}
