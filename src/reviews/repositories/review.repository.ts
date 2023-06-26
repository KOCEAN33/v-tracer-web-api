import { Injectable } from '@nestjs/common';
import { Review } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(
    authorId,
    productId,
    title,
    body,
    publishedAt,
  ): Promise<Review> {
    return await this.prisma.review.create({
      data: {
        authorId: authorId,
        productId: productId,
        title: title,
        body: body,
        publishedAt: publishedAt,
        deletedAt: null,
      },
    });
  }

  async patchReview(reviewId, title?, body?): Promise<void> {
    await this.prisma.review.updateMany({
      where: { id: reviewId, deletedAt: null },
      data: { title: title, body: body },
    });
  }

  async getReviewsByProduct(product?, productId?): Promise<Review[]> {
    return await this.prisma.review.findMany({
      where: {
        product: { id: productId, handle: product },
        deletedAt: null,
        publishedAt: { not: null },
      },
    });
  }

  async getReviewsByUserIdProductId(userId, productId): Promise<Review[]> {
    return await this.prisma.review.findMany({
      where: {
        authorId: userId,
        productId: productId,
        deletedAt: null,
        publishedAt: { not: null },
      },
    });
  }

  async getAuthorIdByReviewId(
    reviewId,
  ): Promise<{ authorId: string; deletedAt: null | Date }> {
    return await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: { authorId: true, deletedAt: true },
    });
  }

  async deleteSoftReview(reviewId): Promise<void> {
    await this.prisma.review.update({
      where: { id: reviewId },
      data: { deletedAt: new Date() },
    });
  }
}
