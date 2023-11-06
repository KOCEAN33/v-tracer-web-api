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

  async getReviewsByProduct(productHandle: string) {
    return await this.kysely.db
      .selectFrom('Post')
      .select([
        'Post.id',
        'Post.title',
        'Post.body',
        'Post.publishedAt',
        'Post.authorId',
      ])
      .innerJoin('Product', 'Post.productId', 'Product.id')
      .where('Product.handle', '=', productHandle)
      .execute();
  }

  async createPost(
    title: string,
    body: string,
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
        body: body,
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
