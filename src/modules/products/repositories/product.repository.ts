import { Injectable } from '@nestjs/common';
import { KyselyService } from '../../../database/kysely.service';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from '../../../@types';

@Injectable()
export class ProductRepository {
  constructor(
    private readonly kysely: KyselyService,
    @InjectKysely() private readonly db: DB,
  ) {}

  async createProduct(
    handle: string,
    name: string,
    url: string,
    companyId: number,
  ) {
    return await this.db
      .insertInto('products')
      .values({
        name: name,
        handle: handle,
        url: url,
        company_id: companyId,
        updated_at: new Date(),
      })
      .executeTakeFirst();
  }

  // Query
  async getProductByProductHandle(handle: string) {
    return await this.db
      .selectFrom('products')
      .selectAll()
      .where('handle', '=', handle)
      .executeTakeFirst();
  }

  async getProducts() {
    return await this.db
      .selectFrom('products')
      .select(['id', 'handle', 'name', 'company_id'])
      .execute();
  }
}
