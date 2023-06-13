import { ICommand } from '@nestjs/cqrs';

export class DeleteReviewCommand implements ICommand {
  constructor(
    readonly authorId,
    readonly product,
    readonly title,
    readonly body,
    readonly published,
  ) {}
}
