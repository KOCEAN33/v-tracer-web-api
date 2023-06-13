import { ICommand } from '@nestjs/cqrs';

export class PatchReviewCommand implements ICommand {
  constructor(
    readonly authorId,
    readonly product,
    readonly title,
    readonly body,
    readonly published,
  ) {}
}
