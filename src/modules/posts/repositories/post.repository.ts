import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from '../../../@types';

import { PostStatus, PostType } from '../../../@types/enums';

@Injectable()
export class PostRepository {
  constructor(@InjectKysely() private readonly db: DB) {}

  async getProductByHandle(handle: string) {
    return await this.db
      .selectFrom('products')
      .selectAll()
      .where('handle', '=', handle)
      .executeTakeFirst();
  }

  async getPostById(id: number) {
    return await this.db
      .selectFrom('posts')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async getReviewsByProduct(productHandle: string) {
    return await this.db
      .selectFrom('posts')
      .select([
        'posts.id',
        'posts.title',
        'posts.body',
        'posts.published_at',
        'posts.author_id',
      ])
      .innerJoin('products', 'posts.product_id', 'products.id')
      .where('products.handle', '=', productHandle)
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
    return await this.db
      .insertInto('posts')
      .values({
        title: title,
        body: body,
        type: type,
        status: status,
        product_id: productId,
        author_id: userId,
        published_at: pubAt(status),
        updated_at: new Date(),
      })
      .executeTakeFirstOrThrow();
  }
}
