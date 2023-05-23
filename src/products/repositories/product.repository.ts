import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(name: string, url: string) {
    return await this.prisma.product.create({
      data: { name, url },
    });
  }
}
