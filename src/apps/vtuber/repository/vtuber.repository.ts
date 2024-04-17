import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from '../../../@types';

@Injectable()
export class VtuberRepository {
  constructor(@InjectKysely() private readonly db: DB) {}

  async addNewVtuber(name: string, companyId: number, youtubeUrl: string) {
    return await this.db.transaction().execute(async (trx) => {
      const newVtuber = await trx
        .insertInto('vtubers')
        .values({
          name: name,
          company_id: companyId,
          updated_at: new Date(),
        })
        .executeTakeFirstOrThrow();

      return await trx
        .insertInto('youtubes')
        .values({
          status: 'new',
          url: youtubeUrl,
          name: name,
          updated_at: new Date(),
          vtuber_id: Number(newVtuber.insertId),
        })
        .executeTakeFirstOrThrow();
    });
  }

  async getAllVtubers() {
    return await this.db
      .selectFrom('vtubers')
      .leftJoin('youtubes', 'youtubes.vtuber_id', 'vtubers.id')
      .select(['vtubers.id', 'vtubers.name', 'youtubes.status', 'youtubes.url'])
      .execute();
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

  async getVtuberCount(): Promise<number> {
    const vtuber = await this.db
      .selectFrom('vtubers')
      .select((eb) => eb.fn.count<number>('id').as('num_vtuber'))
      .executeTakeFirst();

    return vtuber.num_vtuber;
  }
}
