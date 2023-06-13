import { ICommand } from '@nestjs/cqrs';

export class CreateReviewByProductHandleCommand implements ICommand {
  constructor(
    readonly authorId,
    readonly productHandle,
    readonly title,
    readonly body,
    readonly published,
  ) {}
}
