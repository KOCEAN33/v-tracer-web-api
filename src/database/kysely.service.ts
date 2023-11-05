import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlanetScaleDialect } from 'kysely-planetscale';
import { Kysely, ParseJSONResultsPlugin } from 'kysely';
import { DB } from './types';

@Injectable()
export class KyselyService {
  constructor(private readonly configService: ConfigService) {}

  private genSecret = () => {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (databaseUrl) {
      const url = databaseUrl.split('/')[2];
      const host = url.split('@')[1];
      const username = url.split(':')[0];
      const password = url.split(':')[1].split('@')[0];
      return { host, username, password };
    }
  };

  public db = new Kysely<DB>({
    dialect: new PlanetScaleDialect({
      host: this.genSecret()?.host || '',
      username: this.genSecret()?.username || '',
      password: this.genSecret()?.password || '',
    }),
    plugins: [new ParseJSONResultsPlugin()],
    // log: ['query', 'error'],
  });
}
