import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreatePostCommand } from './create-post.command';
import { PostRepository } from '../repositories/post.repository';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand>
{
  constructor(private readonly postRepository: PostRepository) {}

  async execute(command: CreatePostCommand) {
    const { title, content, type, status, productHandle, userId } = command;

    const product = await this.postRepository.getProductByHandle(productHandle);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const post = await this.postRepository.createPost(
      title,
      content,
      type,
      status,
      product.id,
      userId,
    );

    const result = await this.postRepository.getPostById(Number(post.insertId));

    return { message: 'Login Success', data: result };
  }
}
