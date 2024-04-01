import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from '../../../@types';

@Injectable()
export class VtuberRepository {
  constructor(@InjectKysely() private readonly db: DB) {}

  async addNewVtuber(name: string, companyId: number, youtubeUrl: string) {
    return await this.db.transaction().execute(async (trx) => {
      const youtube = await trx
        .insertInto('youtubes')
        .values({
          status: 'new',
          url: youtubeUrl,
          updated_at: new Date(),
        })
        .executeTakeFirstOrThrow();

      return await trx
        .insertInto('vtubers')
        .values({
          name: name,
          company_id: companyId,
          updated_at: new Date(),
        })
        .executeTakeFirstOrThrow();
    });
  }

  async getYoutubeUrl(youtubeUrl: string) {
    return await this.db
      .selectFrom('youtubes')
      .select('url')
      .where('url', '=', youtubeUrl)
      .executeTakeFirst();
  }

  async addNewCompany(name: string, url: string) {
    return await this.db
      .insertInto('companies')
      .values({ name: name, url: url, updated_at: new Date() })
      .executeTakeFirstOrThrow();
  }

  async getCompanyByUrl(url: string) {
    return await this.db
      .selectFrom('companies')
      .select('url')
      .where('url', '=', url)
      .executeTakeFirst();
  }
}
