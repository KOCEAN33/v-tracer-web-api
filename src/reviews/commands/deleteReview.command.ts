import { ICommand } from '@nestjs/cqrs';

export class DeleteReviewCommand implements ICommand {
  constructor(readonly userId: string, readonly reviewId: string) {}
}
