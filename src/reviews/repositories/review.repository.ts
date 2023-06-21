import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma, Review } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(authorId, productId, title, body, publishedAt) {
    return await this.prisma.review.create({
      data: {
        authorId: authorId,
        productId: productId,
        title: title,
        body: body,
        publishedAt: publishedAt,
      },
    });
  }

  async patchReview(reviewId, title?, body?) {
    return await this.prisma.review.update({
      where: { id: reviewId },
      data: { title: title, body: body },
    });
  }

  // Query
  async getReviewById(reviewId) {
    try {
      return await this.prisma.review.findUnique({
        where: { id: reviewId },
        select: { authorId: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new NotFoundException(`Requested review does not exist`);
        // PrismaClientKnownRequestError 처리 코드 작성
        // ...
      }
    }
  }

  async getReviewsByProduct(handle?, productId?) {
    return await this.prisma.product.findMany({
      where: { id: productId, handle: handle },
      include: { review: { take: 3, where: { publishedAt: { not: null } } } },
    });
  }

  async getReviewsByUserId(userId) {
    return await this.prisma.review.findMany({
      where: { authorId: userId },
    });
  }

  async getReviewAuthorByID(authorId, reviewId) {
    return await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: { authorId: true },
    });
  }
}
