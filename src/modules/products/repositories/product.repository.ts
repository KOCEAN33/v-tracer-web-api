import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(handle, name, url?) {
    return await this.prisma.product.create({
      data: { handle, name, url },
    });
  }

  // Query
  async getProductByProductHandle(handle) {
    return await this.prisma.product.findUnique({ where: { handle: handle } });
  }
}
