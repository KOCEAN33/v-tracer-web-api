import { Injectable } from '@nestjs/common';
import { InjectKysely } from 'nestjs-kysely';
import { DB } from '../../../@types';

@Injectable()
export class StreamsRepository {
  constructor(@InjectKysely() private readonly db: DB) {}

  async addNewVtuber() {}

  async addNewCompany() {}
}