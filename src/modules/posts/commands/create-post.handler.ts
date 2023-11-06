import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

import { PostRepository } from '../repositories/post.repository';
import { CreatePostCommand } from './create-post.command';

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand>
{
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: CreatePostCommand) {
    const { title, content, type, status, productHandle, userId } = command;

    const product = await this.postRepository.getProductByHandle(productHandle);

    if (!product) {
      throw new NotFoundException('invalid product handle');
    }

    const post = await this.postRepository.createPost(
      title,
      content,
      type,
      status,
      product.id,
      userId,
    );

    const result = Number(post.insertId);

    return { message: 'post success', data: result };
  }
}
