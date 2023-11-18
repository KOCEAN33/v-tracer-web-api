import { ICommand } from '@nestjs/cqrs';
import { PostStatus, PostType } from '../../../@types/enums';

export class CreatePostCommand implements ICommand {
  constructor(
    readonly title: string,
    readonly content: string,
    readonly type: PostType,
    readonly status: PostStatus,
    readonly productHandle: string,
    readonly userId: number,
  ) {}
}
