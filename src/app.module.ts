import { MysqlDialect, ParseJSONResultsPlugin } from 'kysely';
import { ConfigModule } from '@nestjs/config';
import { KyselyModule } from 'nestjs-kysely';
import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { createPool } from 'mysql2';
import { v4 } from 'uuid';

import config from './config/config';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EmailModule } from './modules/email/email.module';
import { AppController } from './app.controller';
import { VtuberModule } from './modules/vtuber/vtuber.module';
import { StreamsModule } from './modules/streams/streams.module';
import { GamesModule } from './modules/games/games.module';

import { ExceptionModule } from './common/exception/exception.module';
import { LoggerModule } from './libs/logger/logger.module';
import { CacheManagerModule } from './libs/cache-manager/cache-manager.module';

const genSecret = () => {
  const databaseUrl = process.env.DATABASE_URL as string;
  if (databaseUrl) {
    const url = databaseUrl.split('/')[2];
    const database = databaseUrl.split('/')[3];
    const host = url.split(':')[1].split('@')[1];
    const port = Number(url.split(':')[2]);
    const username = url.split(':')[0];
    const password = url.split(':')[1].split('@')[0];
    return { host, port, username, password, database };
  }
};

@Module({
  imports: [
    LoggerModule,
    CacheManagerModule,
    ConfigModule.forRoot({
      envFilePath: [`.${process.env.NODE_ENV}.env`],
      load: [config],
      cache: true,
      isGlobal: true,
    }),
    KyselyModule.forRoot({
      dialect: new MysqlDialect({
        pool: createPool({
          host: genSecret()?.host || '',
          port: genSecret()?.port || 3306,
          user: genSecret()?.username || '',
          password: genSecret()?.password || '',
          database: genSecret()?.database || '',
          ssl: {
            ca: process.env.DATABASE_CA_CERT,
            cert: process.env.DATABASE_CLIENT_CERT,
            key: process.env.DATABASE_CLIENT_KEY,
            rejectUnauthorized: true,
            minVersion: 'TLSv1.2',
          },
        }),
      }),
      plugins: [new ParseJSONResultsPlugin()],
      // log: ['query', 'error'],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) => req.headers['x-correlation-id'] ?? v4(),
      },
    }),
    AuthModule,
    UsersModule,
    EmailModule,
    ExceptionModule,
    VtuberModule,
    StreamsModule,
    GamesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
