import { ICommand } from '@nestjs/cqrs';

export class DeleteReviewCommand implements ICommand {
  constructor(readonly authorId, readonly reviewId) {}
}
