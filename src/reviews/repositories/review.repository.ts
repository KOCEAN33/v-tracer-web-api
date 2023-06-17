import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Review } from '@prisma/client';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(authorId, productId, title, body) {
    return await this.prisma.review.create({
      data: {
        authorId: authorId,
        productId: productId,
        title: title,
        body: body,
        publishedAt: new Date(),
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

  async getReviewsByProductHandle(handle): Promise<Review[]> {
    const data = await this.prisma.product.findMany({
      where: { handle: handle },
      include: { review: { take: 3, where: { publishedAt: { not: null } } } },
    });
    return data[0].review;
  }

  async getReviewsByUserId(userId) {
    return await this.prisma.review.findMany({
      where: { authorId: userId },
    });
  }
}
