import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlanetScaleDialect } from 'kysely-planetscale';
import { DB } from './types';
import { Kysely } from 'kysely';

@Injectable()
export class KyselyService {
  constructor(private readonly configService: ConfigService) {}

  private genSecret = () => {
    if (process.env.DATABASE_URL) {
      const url = process.env.DATABASE_URL.split('/')[2];
      const username = url.split(':')[0];
      const password = url.split(':')[1].split('@')[0];
      return { username, password };
    }
  };

  public db = new Kysely<DB>({
    dialect: new PlanetScaleDialect({
      host: 'gcp.connect.psdb.cloud',
      username: this.genSecret()?.username || '',
      password: this.genSecret()?.password || '',
    }),
  });
}
