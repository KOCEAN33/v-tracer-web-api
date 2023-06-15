import { ICommand } from '@nestjs/cqrs';

export class CreateReviewCommand implements ICommand {
  constructor(
    readonly authorId,
    readonly productId,
    readonly title,
    readonly body,
    readonly published,
  ) {}
}
