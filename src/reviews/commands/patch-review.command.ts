import { ICommand } from '@nestjs/cqrs';

export class PatchReviewCommand implements ICommand {
  constructor(
    readonly authorId,
    readonly reviewId,
    readonly title,
    readonly body,
    readonly publish,
  ) {}
}
