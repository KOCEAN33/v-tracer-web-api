import { IQuery } from '@nestjs/cqrs';

export class GetMyProfileQuery implements IQuery {
  constructor(readonly userId: number) {}
}
