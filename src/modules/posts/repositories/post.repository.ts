import { Injectable } from '@nestjs/common';
import { KyselyService } from '../../../database/kysely.service';
import { PostStatus, PostType } from '../../../database/enums';

@Injectable()
export class PostRepository {
  constructor(private readonly kysely: KyselyService) {}

  async getProductByHandle(handle: string) {
    return await this.kysely.db
      .selectFrom('Product')
      .selectAll()
      .where('handle', '=', handle)
      .executeTakeFirst();
  }

  async getPostById(id: number) {
    return await this.kysely.db
      .selectFrom('Post')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async createPost(
    title: string,
    content: string,
    type: PostType,
    status: PostStatus,
    productId: number,
    userId: number,
  ) {
    const pubAt = (status: string) => {
      if (status === 'PUBLISHED') {
        return new Date();
      }
      return null;
    };
    return await this.kysely.db
      .insertInto('Post')
      .values({
        title: title,
        content: content,
        type: type,
        status: status,
        productId: productId,
        authorId: userId,
        publishedAt: pubAt(status),
        updatedAt: new Date(),
      })
      .executeTakeFirstOrThrow();
  }
}
