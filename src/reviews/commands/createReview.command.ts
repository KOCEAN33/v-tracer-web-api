import { ICommand } from '@nestjs/cqrs';

export class CreateReviewCommand implements ICommand {
  constructor(
    readonly authorId: string,
    readonly productId: string,
    readonly title: string,
    readonly body: string,
    readonly publish: boolean,
  ) {}
}
