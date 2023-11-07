import { Injectable } from '@nestjs/common';
import { KyselyService } from '../../../database/kysely.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly kysely: KyselyService) {}

  async createProduct(
    handle: string,
    name: string,
    url: string,
    companyId: number,
  ) {
    return await this.kysely.db
      .insertInto('Product')
      .values({
        name: name,
        handle: handle,
        url: url,
        companyId: companyId,
        updatedAt: new Date(),
      })
      .executeTakeFirst();
  }

  // Query
  async getProductByProductHandle(handle: string) {
    return await this.kysely.db
      .selectFrom('Product')
      .selectAll()
      .where('handle', '=', handle)
      .executeTakeFirst();
  }

  async getProducts() {
    return await this.kysely.db
      .selectFrom('Product')
      .select(['id', 'handle', 'name', 'companyId'])
      .execute();
  }
}
