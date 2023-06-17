import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(handle, name, url?) {
    return await this.prisma.product.create({
      data: { handle, name, url },
    });
  }

  async updateProduct(handle, name, ownerId, url) {
    return await this.prisma.product.update({
      where: { handle: handle },
      data: { name, ownerId, url },
    });
  }

  // Query
  async getProductByProductHandle(handle) {
    return await this.prisma.product.findUnique({ where: { handle: handle } });
  }
}
