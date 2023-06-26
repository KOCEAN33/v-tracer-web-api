import { ICommand } from '@nestjs/cqrs';

export class PatchReviewCommand implements ICommand {
  constructor(
    readonly authorId: string,
    readonly reviewId: string,
    readonly title: string,
    readonly body: string,
    readonly publish: boolean,
  ) {}
}
