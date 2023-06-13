import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(authorId, productId, title, body, published?) {
    return await this.prisma.review.create({
      data: {
        authorId: authorId,
        productId: productId,
        title: title,
        body: body,
        published: published,
      },
    });
  }

  // Query
  async getProductByProductHandle(handle) {
    return await this.prisma.product.findUnique({ where: { handle: handle } });
  }

  async getReviewsByProductHandle(handle): Promise<Review[]> {
    const data = await this.prisma.product.findMany({
      where: { handle: handle },
      include: { review: { take: 3, where: { published: true } } },
    });
    return data[0].review;
  }

  async getReviewsByUserId(userId) {
    return await this.prisma.review.findMany({
      where: { authorId: userId },
    });
  }
}
