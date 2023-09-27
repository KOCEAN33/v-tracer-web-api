import { IQuery } from '@nestjs/cqrs';

export class GetMyInfoQuery implements IQuery {
  constructor(readonly userId: string) {}
}
